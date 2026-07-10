import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
    paddingTop: 40,
    paddingBottom: 40,
    paddingLeft: 45,
    paddingRight: 45,
    fontSize: 10,
    color: "#1e293b",
    lineHeight: 1.4,
  },
  
  // Bloc Expéditeur
  senderContainer: {
    marginBottom: 3,
    flexDirection: "column",
   
  },
  senderName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 5,
  },
  
  // Grille pour les contacts (2 colonnes)
  contactGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
   
  },
  senderContactLine: {
    width: "50%",
    fontSize: 9.5,
    color: "#334155",
    marginBottom: 3,
  },
  senderLink: {
    color: "#334155",
    textDecoration: "none",
  },

  // Alignement de la date seule à droite
  dateContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  dateText: {
    fontSize: 10,
    color: "#334155",
    textAlign: "right",
  },

  // Bloc Destinataire Centré avec petites lignes en haut et en bas
  recipientCenterBox: {
    alignSelf: "center",       // Centre le bloc sur la page
    width: "60%",              // Largeur limitée pour faire une "petite ligne"
    textAlign: "center",       // Centre le texte à l'intérieur
    marginBottom: 10,
    paddingTop: 6,             // Espace entre le texte et la ligne du haut
    paddingBottom: 6,          // Espace entre le texte et la ligne du bas
    borderTopWidth: 1,
    borderTopColor: "#cbd5e1",
    borderTopStyle: "solid",
    borderBottomWidth: 1,
    borderBottomColor: "#cbd5e1",
    borderBottomStyle: "solid",
  },
  recipientText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#0f172a",
    textAlign: "center",
  },
  recipientService: {
    fontSize: 10,
    color: "#334155",
    textAlign: "center",
    marginTop: 3,
  },

  // Bloc Objet
  objetContainer: {
    marginBottom: 18,
  },
  objetText: {
    fontSize: 10.5,
    fontWeight: "bold",
    color: "#0f172a",
  },

  // Corps de la lettre
  bodyContainer: {
    flexDirection: "column",
  },
  paragraph: {
    fontSize: 10,
    color: "#232936",
    textAlign: "justify",
    marginBottom: 10,
  },

  // Signature
  signatureContainer: {
    marginTop: 25,
    flexDirection: "column",
    alignItems: "flex-end",
    paddingRight: 10,
  },
  signatureName: {
    fontSize: 10.5,
    fontWeight: "bold",
    color: "#0f172a",
  }
});

const ensureAbsoluteUrl = (url) => {
  if (!url) return "";
  return url.startsWith("http://") || url.startsWith("https://")
    ? url
    : `https://${url}`;
};

export default function LettreMotivation({ 
  nom, 
  contactList, 
  objet, 
  texte,
  entreprise,
  attention = "À l'attention du service des Ressources Humaines",
  lieuDate
}) {
  
  const paragraphes = texte 
    ? texte.split("\n").filter(p => p.trim() !== "") 
    : [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* EXPÉDITEUR (2 COLONNES) */}
        <View style={styles.senderContainer}>
          <Text style={styles.senderName}>{nom}</Text>
          <View style={styles.contactGrid}>
            {contactList && contactList.map((contact, index) => {
              if (!contact || !contact.value) return null;
              
              const { label, value } = contact;
              const isLink = ["linkedin", "github", "site web", "portfolio"].includes(label.toLowerCase());
              const isEmail = label.toLowerCase() === "email";

              return (
                <Text key={index} style={styles.senderContactLine}>
                  <Text style={{ fontWeight: "medium" }}>{label}: </Text>
                  {isLink ? (
                    <Link src={ensureAbsoluteUrl(value)} style={styles.senderLink}>{value}</Link>
                  ) : isEmail ? (
                    <Link src={`mailto:${value}`} style={styles.senderLink}>{value}</Link>
                  ) : (
                    value
                  )}
                </Text>
              );
            })}
          </View>
        </View>

        {/* DATE (À DROITE) */}
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{lieuDate}</Text>
        </View>

        {/* DESTINATAIRE (CENTRÉ AVEC LIGNES HAUT/BAS) */}
        <View style={styles.recipientCenterBox}>
          <Text style={styles.recipientText}>{entreprise}</Text>
          {attention && <Text style={styles.recipientService}>{attention}</Text>}
        </View>

        {/* OBJET */}
        <View style={styles.objetContainer}>
          <Text style={styles.objetText}>Objet: {objet}</Text>
        </View>

        {/* CORPS DE LA LETTRE */}
        <View style={styles.bodyContainer}>
          {paragraphes.map((para, index) => (
            <Text key={index} style={styles.paragraph}>
              {para.trim()}
            </Text>
          ))}
        </View>

        {/* SIGNATURE */}
        <View style={styles.signatureContainer} wrap={false}>
          <Text style={styles.signatureName}>{nom}</Text>
        </View>

      </Page>
    </Document>
  );
}