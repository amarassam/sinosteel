from flask import Flask, jsonify, request, render_template, send_from_directory
from flask_cors import CORS
import pymysql
from config import Config
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND_DIR = os.path.join(BASE_DIR, 'frontend')

app = Flask(__name__, template_folder=FRONTEND_DIR)
CORS(app)
app.config.from_object(Config)

# ── Servir les fichiers statiques (CSS, JS) ──
@app.route('/css/<path:filename>')
def css_files(filename):
    return send_from_directory(os.path.join(FRONTEND_DIR, 'css'), filename)

@app.route('/js/<path:filename>')
def js_files(filename):
    return send_from_directory(os.path.join(FRONTEND_DIR, 'js'), filename)

@app.route('/images/<path:filename>')
def image_files(filename):
    return send_from_directory(os.path.join(FRONTEND_DIR, 'images'), filename)

# ── Connexion DB ──
def get_db():
    conn = pymysql.connect(
        host=app.config['MYSQL_HOST'],
        user=app.config['MYSQL_USER'],
        password=app.config['MYSQL_PASSWORD'],
        database=app.config['MYSQL_DB'],
        port=app.config['MYSQL_PORT'],
        cursorclass=pymysql.cursors.DictCursor,
        charset='utf8mb4'
    )
    return conn

# ── Pages HTML ──
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/services')
def services_page():
    return render_template('services.html')

@app.route('/projects')
def projects_page():
    return render_template('projects.html')

@app.route('/contact')
def contact_page():
    return render_template('contact.html')

# ── API Projets ──
@app.route('/api/projets', methods=['GET'])
def get_projets():
    try:
        conn = get_db()
        with conn.cursor() as cur:
            categorie = request.args.get('categorie')
            if categorie:
                cur.execute("SELECT * FROM projets WHERE categorie = %s ORDER BY cree_le DESC", (categorie,))
            else:
                cur.execute("SELECT * FROM projets ORDER BY cree_le DESC")
            projets = cur.fetchall()
        conn.close()
        for p in projets:
            for key in ['date_debut', 'date_fin', 'cree_le', 'mis_a_jour']:
                if p.get(key):
                    p[key] = str(p[key])
        return jsonify({'success': True, 'data': projets})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# ── API Services ──
@app.route('/api/services', methods=['GET'])
def get_services():
    try:
        conn = get_db()
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM services WHERE actif = TRUE ORDER BY ordre ASC")
            services = cur.fetchall()
        conn.close()
        return jsonify({'success': True, 'data': services})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# ── API Statistiques ──
@app.route('/api/statistiques', methods=['GET'])
def get_statistiques():
    try:
        conn = get_db()
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM statistiques ORDER BY ordre ASC")
            stats = cur.fetchall()
        conn.close()
        return jsonify({'success': True, 'data': stats})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# ── API Equipe ──
@app.route('/api/equipe', methods=['GET'])
def get_equipe():
    try:
        conn = get_db()
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM equipe WHERE actif = TRUE ORDER BY ordre ASC")
            equipe = cur.fetchall()
        conn.close()
        return jsonify({'success': True, 'data': equipe})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# ── API Contact ──
@app.route('/api/contact', methods=['POST'])
def envoyer_message():
    try:
        data = request.get_json()
        for champ in ['nom', 'email', 'message']:
            if not data.get(champ):
                return jsonify({'success': False, 'error': f'Le champ {champ} est obligatoire'}), 400
        conn = get_db()
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO messages_contact (nom, email, telephone, sujet, message)
                VALUES (%s, %s, %s, %s, %s)
            """, (data['nom'], data['email'], data.get('telephone',''), data.get('sujet',''), data['message']))
            conn.commit()
        conn.close()
        return jsonify({'success': True, 'message': 'Message envoyé avec succès!'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    print("🚀 Serveur Sinosteel démarré sur http://localhost:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)