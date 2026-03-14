-- ============================================
-- BASE DE DONNÉES SINOSTEEL
-- ============================================

CREATE DATABASE IF NOT EXISTS sinosteel_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE sinosteel_db;

-- ============================================
-- TABLE: utilisateurs (admin du site)
-- ============================================
CREATE TABLE IF NOT EXISTS utilisateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    role ENUM('admin', 'editeur') DEFAULT 'editeur',
    cree_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLE: projets
-- ============================================
CREATE TABLE IF NOT EXISTS projets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(200) NOT NULL,
    description TEXT,
    categorie ENUM('concassage', 'separation', 'traitement', 'construction') NOT NULL,
    localisation VARCHAR(200),
    date_debut DATE,
    date_fin DATE,
    statut ENUM('en_cours', 'termine', 'planifie') DEFAULT 'planifie',
    image_url VARCHAR(500),
    cree_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    mis_a_jour TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- TABLE: services
-- ============================================
CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(200) NOT NULL,
    description TEXT,
    icone VARCHAR(100),
    ordre INT DEFAULT 0,
    actif BOOLEAN DEFAULT TRUE
);

-- ============================================
-- TABLE: messages_contact
-- ============================================
CREATE TABLE IF NOT EXISTS messages_contact (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    telephone VARCHAR(30),
    sujet VARCHAR(200),
    message TEXT NOT NULL,
    lu BOOLEAN DEFAULT FALSE,
    envoye_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLE: equipe
-- ============================================
CREATE TABLE IF NOT EXISTS equipe (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    poste VARCHAR(150),
    biographie TEXT,
    photo_url VARCHAR(500),
    email VARCHAR(150),
    ordre INT DEFAULT 0,
    actif BOOLEAN DEFAULT TRUE
);

-- ============================================
-- TABLE: statistiques
-- ============================================
CREATE TABLE IF NOT EXISTS statistiques (
    id INT AUTO_INCREMENT PRIMARY KEY,
    label VARCHAR(100) NOT NULL,
    valeur VARCHAR(50) NOT NULL,
    icone VARCHAR(100),
    ordre INT DEFAULT 0
);

-- ============================================
-- DONNÉES INITIALES
-- ============================================

-- Admin par défaut (mot de passe: admin123 - à changer!)
INSERT INTO utilisateurs (nom, email, mot_de_passe, role) VALUES
('Administrateur', 'admin@sinosteel.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMaJObD.RrAlp1D7aFcIXVHX1a', 'admin');

-- Services
INSERT INTO services (titre, description, icone, ordre) VALUES
('Concassage', 'Traitement et concassage de minerais avec des équipements de haute précision pour obtenir la granulométrie souhaitée.', 'fas fa-industry', 1),
('Séparation à Sec', 'Technologie avancée de séparation magnétique et électrostatique à sec, sans utilisation d''eau.', 'fas fa-filter', 2),
('Traitement des Minerais', 'Processus complet de traitement incluant broyage, classification et enrichissement des minerais.', 'fas fa-cogs', 3),
('Construction d''Usines', 'Conception et construction clé en main d''usines industrielles modernes et efficaces.', 'fas fa-building', 4),
('Ingénierie & Conseil', 'Bureau d''études spécialisé dans l''optimisation des procédés miniers et industriels.', 'fas fa-drafting-compass', 5),
('Maintenance & Support', 'Service de maintenance préventive et corrective 24h/24 pour garantir la continuité de production.', 'fas fa-tools', 6);

-- Projets
INSERT INTO projets (titre, description, categorie, localisation, date_debut, date_fin, statut) VALUES
('Usine de Concassage - Phase 1', 'Construction d''une usine de concassage primaire avec une capacité de 500 tonnes/heure.', 'concassage', 'Béchar, Algérie', '2023-01-15', '2024-06-30', 'termine'),
('Ligne de Séparation Magnétique', 'Installation d''une ligne complète de séparation magnétique à sec pour le traitement du fer.', 'separation', 'Tindouf, Algérie', '2024-03-01', '2025-12-31', 'en_cours'),
('Unité de Traitement - Gara Djebilet', 'Projet de traitement du minerai de fer du gisement de Gara Djebilet.', 'traitement', 'Tindouf, Algérie', '2025-01-01', NULL, 'planifie');

-- Statistiques
INSERT INTO statistiques (label, valeur, icone, ordre) VALUES
('Projets Réalisés', '50+', 'fas fa-check-circle', 1),
('Années d''Expérience', '15+', 'fas fa-calendar-alt', 2),
('Tonnes Traitées / Heure', '2000+', 'fas fa-weight', 3),
('Pays d''Intervention', '8', 'fas fa-globe', 4);

-- Équipe
INSERT INTO equipe (nom, poste, biographie, ordre) VALUES
('Zhang Wei', 'Directeur Général', 'Ingénieur en génie minier avec plus de 20 ans d''expérience dans l''industrie minière internationale.', 1),
('Mohamed Benali', 'Directeur Technique', 'Expert en traitement des minerais et conception d''usines industrielles en Afrique du Nord.', 2),
('Li Fang', 'Chef de Projet', 'Spécialiste en gestion de projets industriels complexes et coordination internationale.', 3);

SELECT 'Base de données Sinosteel créée avec succès!' AS message;
