/**
 * EXEMPLES D'UTILISATION DU MODÈLE DE DONNÉES
 * Pour le simulateur de régimes fiscal et social
 */

import {
  determinerRegimeFiscal,
  determinerRegimeSocial,
  type NatureActivite,
  obtenirTauxAbattement,
  obtenirTauxCotisationsMicroSocial,
  REGIMES_FISCAUX,
  REGIMES_SOCIAUX,
} from "./modele-regimes";

// ============================================================================
// EXEMPLE 1 : Détermination automatique des régimes
// ============================================================================

function exempleSimulationComplete() {
  const ca = 45000; // Chiffre d'affaires annuel
  const natureActivite: NatureActivite = "PRESTATIONS_SERVICES_BNC";

  // Déterminer les régimes applicables
  const regimeFiscal = determinerRegimeFiscal(ca, natureActivite, false);
  const regimeSocial = determinerRegimeSocial(ca, natureActivite, false);

  console.log("=== SIMULATION COMPLÈTE ===");
  console.log(`CA annuel: ${ca}€`);
  console.log(`Nature activité: ${natureActivite}`);
  console.log(`\nRégime fiscal applicable: ${regimeFiscal.nom}`);
  console.log(`Régime social applicable: ${regimeSocial.nom}`);

  // Calculer le bénéfice imposable (régime micro)
  if (regimeFiscal.id === "MICRO") {
    const tauxAbattement = obtenirTauxAbattement(natureActivite);
    const beneficeImposable = ca * (1 - tauxAbattement / 100);
    console.log(
      `\nBénéfice imposable: ${beneficeImposable}€ (abattement ${tauxAbattement}%)`,
    );
  }

  // Calculer les cotisations sociales (régime micro-social)
  if (regimeSocial.id === "MICRO_SOCIAL") {
    const tauxCotisations = obtenirTauxCotisationsMicroSocial(natureActivite);
    const cotisations = ca * (tauxCotisations / 100);
    console.log(
      `\nCotisations sociales: ${cotisations}€ (taux ${tauxCotisations}%)`,
    );
  }
}

// ============================================================================
// EXEMPLE 2 : Comparaison micro vs réel
// ============================================================================

function exempleComparaisonRegimes() {
  const ca = 60000;
  const chargesReelles = 25000; // Charges professionnelles réelles
  const natureActivite: NatureActivite = "PRESTATIONS_SERVICES_BNC";

  console.log("\n=== COMPARAISON MICRO VS RÉEL ===");
  console.log(`CA: ${ca}€`);
  console.log(`Charges réelles: ${chargesReelles}€`);

  // Option 1 : Régime micro
  const tauxAbattement = obtenirTauxAbattement(natureActivite);
  const beneficeMicro = ca * (1 - tauxAbattement / 100);

  console.log(`\nOPTION MICRO:`);
  console.log(`- Abattement forfaitaire: ${tauxAbattement}%`);
  console.log(`- Bénéfice imposable: ${beneficeMicro}€`);

  // Option 2 : Régime réel
  const beneficeReel = ca - chargesReelles;

  console.log(`\nOPTION RÉEL:`);
  console.log(`- Charges déductibles: ${chargesReelles}€`);
  console.log(`- Bénéfice imposable: ${beneficeReel}€`);

  // Recommandation
  const economie = beneficeMicro - beneficeReel;
  if (economie > 0) {
    console.log(
      `\n✅ Le régime RÉEL est plus avantageux (économie: ${economie}€ sur le bénéfice imposable)`,
    );
  } else {
    console.log(`\n✅ Le régime MICRO est plus avantageux`);
  }
}

// ============================================================================
// EXEMPLE 3 : Calcul détaillé des cotisations sociales
// ============================================================================

function exempleCalculCotisationsDetaille() {
  const ca = 50000;
  const natureActivite: NatureActivite = "PRESTATIONS_SERVICES_BNC";

  const regimeSocial = REGIMES_SOCIAUX.MICRO_SOCIAL;
  const tauxCotisation = regimeSocial.tauxCotisations.find(
    (tc) => tc.categorie === natureActivite,
  )!;

  console.log("\n=== DÉTAIL DES COTISATIONS SOCIALES ===");
  console.log(`CA: ${ca}€`);
  console.log(`Taux global: ${tauxCotisation.tauxGlobal}%`);
  console.log(`\nRépartition:`);

  const repartition = tauxCotisation.repartition;
  Object.entries(repartition).forEach(([nom, taux]) => {
    const montant = ca * (taux / 100);
    console.log(`- ${nom}: ${taux}% = ${montant.toFixed(2)}€`);
  });

  const cotisationsTotal = ca * (tauxCotisation.tauxGlobal / 100);
  console.log(`\nTotal cotisations: ${cotisationsTotal.toFixed(2)}€`);

  // Ajouter les cotisations annexes
  console.log(`\nCotisations annexes:`);
  regimeSocial.cotisationsAnnexes.forEach((annexe) => {
    const taux = annexe.tauxParActivite[natureActivite];
    const montant = ca * (taux / 100);
    console.log(`- ${annexe.nom}: ${taux}% = ${montant.toFixed(2)}€`);
  });
}

// ============================================================================
// EXEMPLE 4 : Vérification d'éligibilité ACRE
// ============================================================================

function exempleVerificationACRE() {
  const premiereAnnee = true;
  const acreDejaUtilise = false;
  const ca = 40000;

  console.log("\n=== VÉRIFICATION ÉLIGIBILITÉ ACRE ===");

  const regimeSocial = REGIMES_SOCIAUX.MICRO_SOCIAL;
  const acre = regimeSocial.exonerationsApplicables.find((e) =>
    e.nom.includes("ACRE"),
  );

  if (!acre) {
    console.log("❌ ACRE non disponible");
    return;
  }

  console.log(`Conditions ACRE:`);
  acre.conditions.forEach((condition) => {
    console.log(`- ${condition}`);
  });

  const eligible = premiereAnnee && !acreDejaUtilise;

  if (eligible) {
    console.log(`\n✅ Éligible à l'ACRE`);
    console.log(`Réduction: ${acre.montantReduction}`);
    console.log(`Durée: ${acre.duree}`);

    // Calcul avec ACRE
    const natureActivite: NatureActivite = "PRESTATIONS_SERVICES_BNC";
    const tauxNormal = obtenirTauxCotisationsMicroSocial(natureActivite);
    const tauxAvecACRE = tauxNormal * 0.5; // 50% de réduction

    const cotisationsNormales = ca * (tauxNormal / 100);
    const cotisationsAvecACRE = ca * (tauxAvecACRE / 100);
    const economie = cotisationsNormales - cotisationsAvecACRE;

    console.log(`\nÉconomie année 1:`);
    console.log(`- Sans ACRE: ${cotisationsNormales.toFixed(2)}€`);
    console.log(`- Avec ACRE: ${cotisationsAvecACRE.toFixed(2)}€`);
    console.log(`- Économie: ${economie.toFixed(2)}€`);
  } else {
    console.log(`\n❌ Non éligible à l'ACRE`);
  }
}

// ============================================================================
// EXEMPLE 5 : Calcul du revenu net disponible
// ============================================================================

function exempleCalculRevenuNet() {
  const ca = 50000;
  const chargesReelles = 10000; // Charges professionnelles
  const natureActivite: NatureActivite = "PRESTATIONS_SERVICES_BNC";

  console.log("\n=== CALCUL DU REVENU NET DISPONIBLE ===");
  console.log(`CA: ${ca}€`);
  console.log(`Charges professionnelles: ${chargesReelles}€`);

  // Régime micro
  const tauxAbattement = obtenirTauxAbattement(natureActivite);
  const tauxCotisations = obtenirTauxCotisationsMicroSocial(natureActivite);

  const beneficeImposable = ca * (1 - tauxAbattement / 100);
  const cotisationsSociales = ca * (tauxCotisations / 100);

  // Simplification : IR à 11% (TMI moyen)
  const tauxIR = 11;
  const impotSurRevenu = beneficeImposable * (tauxIR / 100);

  const revenuNetDisponible =
    ca - cotisationsSociales - impotSurRevenu - chargesReelles;

  console.log(`\nDétail:`);
  console.log(`- Chiffre d'affaires: ${ca}€`);
  console.log(
    `- Cotisations sociales (${tauxCotisations}%): -${cotisationsSociales.toFixed(2)}€`,
  );
  console.log(
    `- Impôt sur le revenu (${tauxIR}% de ${beneficeImposable}€): -${impotSurRevenu.toFixed(2)}€`,
  );
  console.log(`- Charges professionnelles: -${chargesReelles}€`);
  console.log(`\n💰 REVENU NET DISPONIBLE: ${revenuNetDisponible.toFixed(2)}€`);
  console.log(`Soit ${((revenuNetDisponible / ca) * 100).toFixed(1)}% du CA`);
}

// ============================================================================
// EXEMPLE 6 : Simulation sur 3 ans avec évolution du CA
// ============================================================================

function exempleSimulationTroisAns() {
  const natureActivite: NatureActivite = "PRESTATIONS_SERVICES_BNC";

  const scenarios = [
    { annee: 1, ca: 35000, chargesReelles: 8000, avecACRE: true },
    { annee: 2, ca: 55000, chargesReelles: 12000, avecACRE: false },
    { annee: 3, ca: 80000, chargesReelles: 18000, avecACRE: false },
  ];

  console.log("\n=== SIMULATION SUR 3 ANS ===");

  scenarios.forEach((scenario) => {
    console.log(`\n--- ANNÉE ${scenario.annee} ---`);
    console.log(`CA: ${scenario.ca}€`);

    const regimeFiscal = determinerRegimeFiscal(
      scenario.ca,
      natureActivite,
      false,
    );
    const regimeSocial = determinerRegimeSocial(
      scenario.ca,
      natureActivite,
      false,
    );

    console.log(`Régime fiscal: ${regimeFiscal.nom}`);
    console.log(`Régime social: ${regimeSocial.nom}`);

    if (regimeSocial.id === "MICRO_SOCIAL") {
      let tauxCotisations = obtenirTauxCotisationsMicroSocial(natureActivite);

      if (scenario.avecACRE) {
        tauxCotisations = tauxCotisations * 0.5;
        console.log(`(Avec ACRE: -50%)`);
      }

      const cotisations = scenario.ca * (tauxCotisations / 100);
      console.log(
        `Cotisations sociales: ${cotisations.toFixed(2)}€ (${tauxCotisations}%)`,
      );
    } else {
      // Régime réel TNS
      const benefice = scenario.ca - scenario.chargesReelles;
      const revenuAbattu = benefice * 0.74; // Abattement 26%
      const cotisations = revenuAbattu * 0.45; // Taux approximatif 45%
      console.log(
        `Cotisations sociales: ${cotisations.toFixed(2)}€ (sur bénéfice de ${benefice}€)`,
      );
    }
  });
}

// ============================================================================
// EXEMPLE 7 : Accès aux informations des régimes
// ============================================================================

function exempleAccesInformationsRegimes() {
  console.log("\n=== INFORMATIONS SUR LES RÉGIMES ===");

  // Liste tous les régimes fiscaux
  console.log("\nRÉGIMES FISCAUX DISPONIBLES:");
  Object.entries(REGIMES_FISCAUX).forEach(([key, regime]) => {
    console.log(`\n${regime.nom}:`);
    console.log(
      `- Obligations comptables: ${regime.obligationsComptables.type}`,
    );
    console.log(
      `- Formulaires: ${regime.obligationsDeclaratives.formulaires.join(", ")}`,
    );
    console.log(
      `- Options: ${regime.optionsDisponibles.map((o) => o.nom).join(", ")}`,
    );
  });

  // Liste tous les régimes sociaux
  console.log("\n\nRÉGIMES SOCIAUX DISPONIBLES:");
  Object.entries(REGIMES_SOCIAUX).forEach(([key, regime]) => {
    console.log(`\n${regime.nom}:`);
    console.log(`- Type d'assiette: ${regime.assietteCalcul.type}`);
    console.log(`- Périodicité: ${regime.periodicite.frequences.join(", ")}`);
    console.log(
      `- Organisme recouvrement: ${regime.organismeRecouvrement.nom}`,
    );
    console.log(
      `- Organismes rattachement: ${regime.organismeRattachement.map((o) => o.type).join(", ")}`,
    );
  });
}

// ============================================================================
// EXEMPLE 8 : Détermination de l'organisme de rattachement selon profession
// ============================================================================

function exempleOrganismeRattachement() {
  const professions = [
    { nom: "Architecte", organisme: "CIPAV" },
    { nom: "Développeur web", organisme: "REGIME_GENERAL_SSI" },
    { nom: "Kinésithérapeute", organisme: "CARPIMKO" },
    { nom: "Médecin", organisme: "CARMF" },
    { nom: "Commerçant", organisme: "REGIME_GENERAL_SSI" },
  ];

  console.log("\n=== ORGANISMES DE RATTACHEMENT PAR PROFESSION ===");

  const regimeSocial = REGIMES_SOCIAUX.MICRO_SOCIAL;

  professions.forEach((profession) => {
    const organisme = regimeSocial.organismeRattachement.find(
      (o) => o.type === profession.organisme,
    );

    if (organisme) {
      console.log(`\n${profession.nom}:`);
      console.log(`- Organisme: ${organisme.type}`);
      console.log(`- Description: ${organisme.description}`);
    }
  });
}

// ============================================================================
// EXÉCUTION DES EXEMPLES
// ============================================================================

console.log(
  "╔════════════════════════════════════════════════════════════════╗",
);
console.log(
  "║  EXEMPLES D'UTILISATION DU MODÈLE DE DONNÉES                  ║",
);
console.log(
  "║  Simulateur Régimes Fiscal & Social - Entreprise Individuelle ║",
);
console.log(
  "╚════════════════════════════════════════════════════════════════╝",
);

// Décommenter les exemples que vous souhaitez exécuter

exempleSimulationComplete();
exempleComparaisonRegimes();
exempleCalculCotisationsDetaille();
exempleVerificationACRE();
exempleCalculRevenuNet();
exempleSimulationTroisAns();
exempleAccesInformationsRegimes();
exempleOrganismeRattachement();
