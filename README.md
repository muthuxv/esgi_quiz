
# Quiz Time



## Installation du projet
```bash
  docker compose up -d
```
Cette commande va démarrer le front, le back et la création de la base de données
Le front est accessible ici : http://localhost:3000
Le back est accessible ici : http://localhost:3001
    
## Authors

- [@muthuxv](https://github.com/muthuxv)
[ - Initialisation du projet et de l'architecture de base avec les routes, les modèles et les contrôleurs du back et du front
  - Interface de création de quiz
  - Déroulement des questions et réponses (Présentation des questions à tous les clients dans une salle lorsque le quiz commence)
  - Notation et résultats des quiz
  - Notifications en temps réel
  - Paramètres de quiz personnalisables (Peer programming avec Maxime-Lao)
]

- [@Maxime-Lao](https://github.com/Maxime-Lao)
[ - Déroulement des questions et réponses (Collecte des réponses des clients et verrouillage des réponses à la fin du temps imparti)
  - Retour en direct sur les réponses
  - Chat en direct lors des quiz
  - Stockage de données persistantes
  - Paramètres de quiz personnalisables (Peer programming avec muthuxv)
]

- [@Ayman-BEDDA](https://github.com/Ayman-BEDDA)
[ - Communication en temps réel avec Socket.IO
  - Fonctionnalité de la salle de quiz
  - Synchronisation des états de jeu
  - Gestion avancée des salles
]

- [@SimonBTSSio](https://github.com/SimonBTSSio)
[ - Minuteur côté serveur
  - Page quiz-manage pour l'admin
  - Réglage du temps par question en temps réel
  - Dockerisation ]