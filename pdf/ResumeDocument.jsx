import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Link,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
    padding: 35,
    fontSize: 9.5,
    color: "#1e293b",
  },
  
  // En-tête
  headerContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderBottom: "1px solid #94a3b8",
    paddingBottom: 15,
    marginBottom: 12,
  },
  photo: {
    width: 90,
    height: 110,
    objectFit: "cover",
    borderRadius: 2,
  },
  headerText: {
    flex: 1,
    paddingLeft: 20,
    flexDirection: "column",
  },
  infoNom: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0f172a",
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  infoTitre: {
    fontSize: 10,
    fontWeight: "medium",
    color: "#334155",
    lineHeight: 1.3,
    marginBottom: 8,
  },
  
  // Alignement des contacts 2 par ligne
  contactContainer: {
    flexDirection: "column",
    gap: 3,
  },
  contactRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "100%",
  },
  contactItem: {
    fontSize: 9,
    color: "#334155",
    width: "50%", // Force exactement 2 éléments par ligne
  },
  contactItemLink: {
    fontSize: 9,
    color: "#334155",
    width: "50%", // Force exactement 2 éléments par ligne
  },

  // Titres de Section
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#0f172a",
    marginTop: 14,
    marginBottom: 8,
    borderBottom: "1px solid #cbd5e1",
    paddingBottom: 3,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  profileText: {
    fontSize: 9.5,
    lineHeight: 1.4,
    color: "#334155",
    textAlign: "justify",
  },

  // Format des listes d'expériences
  itemContainer: {
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 2,
  },
  itemTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#0f172a",
    flex: 1,
  },
  itemDate: {
    fontSize: 9,
    color: "#475569",
    fontWeight: "medium",
    textAlign: "right",
    width: 120,
  },
  itemSubtitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 5,
  },
  itemSubtitle: {
    fontSize: 9.5,
    fontWeight: "bold",
    color: "#475569",
  },

  // Rendu strict ligne par ligne pour les expériences
  bulletPoint: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 4,
    paddingLeft: 4,
    width: "100%",
  },
  bullet: {
    width: 10,
    fontSize: 9.5,
    color: "#334155",
  },
  bulletText: {
    flex: 1,
    fontSize: 9.5,
    color: "#334155",
    lineHeight: 1.3,
  },

  // Section Projets
  projectDescription: {
    fontSize: 9.5,
    color: "#334155",
    lineHeight: 1.35,
    marginBottom: 2,
  },
  projectLink: {
    fontSize: 8.5,
    color: "#2563eb",
    textDecoration: "underline",
    marginBottom: 2,
  },

  // Grille de compétences (3 colonnes)
  skillsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  skillColumn: {
    width: "50%",
    marginBottom: 10,
  },
  skillHeader: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 5,
    borderBottom: "1px dashed #e2e8f0",
    paddingBottom: 2,
  },
  skillItem: {
    fontSize: 9,
    color: "#334155",
    lineHeight: 1.3,
    marginBottom: 2,
  }
});
const ensureAbsoluteUrl = (url) => {
  if (!url) return "";
  return url.startsWith("http://") || url.startsWith("https://")
    ? url
    : `https://${url}`;
};

export default function PerfectOriginalResume({ cv, photoUrl }) {
  if (!cv) return null;

  const {
    nom,
    titre,
    profil,
    email,
    num,
    address,
    linkedin,
    siteweb,
    github,
    experiences = [],
    projets = [],
    competences = [],
    formations = []
  } = cv;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* EN-TÊTE AVEC INFOS DE CONTACT 2 PAR LIGNE */}
        {/* <View style={styles.headerContainer} wrap={false}>
          {photoUrl && <Image src={photoUrl} style={styles.photo} />}
          <View style={styles.headerText}>
            <Text style={styles.infoNom}>{nom}</Text>
            <Text style={styles.infoTitre}>{titre}</Text>
            
            <View style={styles.contactContainer}>
              <View style={styles.contactRow}>
                <Text style={styles.contactItem}>{email}</Text>
                {num && <Text style={styles.contactItem}>{num}</Text>}
              </View>
              <View style={styles.contactRow}>
                {address && <Text style={styles.contactItem}>{address}</Text>}
                {linkedin && <Text style={styles.contactItem}>{linkedin}</Text>}
              </View>
              <View style={styles.contactRow}>
                {siteweb && <Text style={styles.contactItem}>{siteweb}</Text>}
                {github && <Text style={styles.contactItem}>{github}</Text>}
              </View>
            </View>
          </View>
        </View> */}
        <View style={styles.headerContainer} wrap={false}>
          {photoUrl && <Image src={photoUrl} style={styles.photo} />}
          <View style={styles.headerText}>
            <Text style={styles.infoNom}>{nom}</Text>
            <Text style={styles.infoTitre}>{titre}</Text>
        <View style={styles.contactContainer}>
              <View style={styles.contactRow}>
                {/* Email cliquable avec mailto: */}
                <Link src={email ? `mailto:${email}` : ""} style={styles.contactItem}>
                  {email}
                </Link>
                {num && <Text style={styles.contactItem}>{num}</Text>}
              </View>
              <View style={styles.contactRow}>
                {address && <Text style={styles.contactItem}>{address}</Text>}
                {linkedin && (
                  <Link src={ensureAbsoluteUrl(linkedin)} style={styles.contactItem}>
                    {linkedin}
                  </Link>
                )}
              </View>
              <View style={styles.contactRow}>
                {siteweb && (
                  <Link src={ensureAbsoluteUrl(siteweb)} style={styles.contactItem}>
                    {siteweb}
                  </Link>
                )}
                {github && (
                  <Link src={ensureAbsoluteUrl(github)} style={styles.contactItem}>
                    {github}
                  </Link>
                )}
              </View>
            </View>
 </View>
  </View>
        {/* PROFIL */}
        {profil && (
          <View wrap={false} style={{ marginBottom: 5 }}>
            <Text style={styles.sectionTitle}>PROFIL</Text>
            <Text style={styles.profileText}>{profil}</Text>
          </View>
        )}

        {/* EXPÉRIENCE PROFESSIONNELLE (Ligne par ligne stricte) */}
        {experiences.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>EXPÉRIENCE PROFESSIONNELLE</Text>
            {experiences.map((exp, index) => {
              const lines = exp.description;
              return (
                <View key={index} style={styles.itemContainer} wrap={false}>
                  <View style={styles.itemRow}>
                    <Text style={styles.itemTitle}>{exp.poste}</Text>
                    <Text style={styles.itemDate}>
                      {exp.datedebut} - {exp.datefin}
                    </Text>
                  </View>
                  <View style={styles.itemSubtitleRow}>
                    <Text style={styles.itemSubtitle}>{exp.entreprise}</Text>
                  </View>
                  {lines.map((line, lIndex) => (
                    <View key={lIndex} style={styles.bulletPoint}>
                      <Text style={styles.bullet}>•</Text>
                      <Text style={styles.bulletText}>
                        {line.replace(/^[•\-\*]\s*/, "").trim()}
                      </Text>
                    </View>
                  ))}
                </View>
              );
            })}
          </View>
        )}

        {/* PROJETS */}
        {projets.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>PROJETS</Text>
            {projets.map((proj, index) => (
              <View key={index} style={styles.itemContainer} wrap={false}>
                <View style={styles.itemRow}>
                  <Text style={styles.itemTitle}>{proj.nom}</Text>
                  <Text style={styles.date}>{proj.date}</Text>
                </View>
                <Text style={styles.projectDescription}>{proj.detail}</Text>
                {proj.lien && (
                  <Text style={styles.projectLink}>lien: {proj.lien}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* COMPÉTENCES CLÉS */}
        {competences.length > 0 && (
          <View wrap={false} style={{ marginTop: 5 }}>
            <Text style={styles.sectionTitle}>COMPÉTENCES CLÉS</Text>
            <View style={styles.skillsGrid}>
              {competences.map((comp, index) => (
                <View key={index} style={styles.skillColumn}>
                  <Text style={styles.skillHeader}>{comp.categorie}</Text>
                  {comp.liste.map((item, iIndex) => (
                    <Text key={iIndex} style={styles.skillItem}>
                      • {item}
                    </Text>
                  ))}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* FORMATION */}
        {formations.length > 0 && (
          <View style={{ marginTop: 5 }}>
            <Text style={styles.sectionTitle}>FORMATION</Text>
            {formations.map((form, index) => (
              <View key={index} style={styles.itemContainer} wrap={false}>
                <View style={styles.itemRow}>
                  <Text style={styles.itemTitle}>{form.diplome}</Text>
                  <Text style={styles.itemDate}>{form.annee}</Text>
                </View>
                <Text style={styles.itemSubtitle}>{form.ecole}</Text>
                
                  {form.description.map((line, lIndex) => (
                    <View key={lIndex} style={styles.bulletPoint}>
                      <Text style={styles.bullet}>•</Text>
                      <Text style={styles.bulletText}>
                        {line.replace(/^[•\-\*]\s*/, "").trim()}
                      </Text>
                    </View>
                  ))}
              </View>
            ))}
          </View>
        )}

      </Page>
    </Document>
  );
}