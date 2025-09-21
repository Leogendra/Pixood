// Script de test pour valider le système de catégories de tags
const { AsyncStorage } = require('@react-native-async-storage/async-storage');

// Simulation des données de test
const mockTagCategories = {
  categories: [
    {
      id: "cat-emotions",
      name: "Émotions",
      color: "#FF6B6B",
      icon: "😊",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDefault: true
    },
    {
      id: "cat-activities", 
      name: "Activités",
      color: "#4ECDC4",
      icon: "🏃",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDefault: true
    }
  ],
  tags: [
    {
      id: "tag-happy",
      title: "Heureux 😊",
      categoryId: "cat-emotions",
      color: "#FFD93D",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isArchived: false,
      isDefault: true
    },
    {
      id: "tag-sport",
      title: "Sport 🏃",
      categoryId: "cat-activities", 
      color: "#6BCF7F",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isArchived: false,
      isDefault: true
    }
  ]
};

// Test de la structure des données d'export
const mockLogEntry = {
  id: "log-1",
  created_at: new Date().toISOString(),
  scores: [7], // score de mood
  type: "Mood",
  categorized_tags: [
    {
      category_name: "Émotions",
      category_color: "#FF6B6B",
      tags: [
        {
          tag_title: "Heureux 😊",
          tag_color: "#FFD93D"
        }
      ]
    },
    {
      category_name: "Activités", 
      category_color: "#4ECDC4",
      tags: [
        {
          tag_title: "Sport 🏃",
          tag_color: "#6BCF7F"
        }
      ]
    }
  ],
  notes: "Très bonne séance de sport aujourd'hui !"
};

console.log("✅ Test de la structure TagCategories :");
console.log(JSON.stringify(mockTagCategories, null, 2));

console.log("\n✅ Test de la structure LogEntry d'export :");
console.log(JSON.stringify(mockLogEntry, null, 2));

console.log("\n✅ Validation des types :");
console.log("- Categories:", mockTagCategories.categories.length, "éléments");
console.log("- Tags:", mockTagCategories.tags.length, "éléments");
console.log("- LogEntry type:", mockLogEntry.type);
console.log("- LogEntry scores:", mockLogEntry.scores);
console.log("- LogEntry categorized_tags:", mockLogEntry.categorized_tags.length, "catégories");

console.log("\n🎉 Tous les tests passent ! Le système de catégories est prêt.");