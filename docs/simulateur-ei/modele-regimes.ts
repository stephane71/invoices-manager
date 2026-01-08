/**
 * Modèle de données pour les régimes fiscal et social
 * Entreprise Individuelle (EI) - France
 * Sources : Service-public.fr, URSSAF, BPI France Création (2025-2026)
 * Dernière mise à jour : Janvier 2026
 */

// ============================================================================
// TYPES DE BASE
// ============================================================================

export type NatureActivite =
  | "VENTE_MARCHANDISES"
  | "HEBERGEMENT"
  | "PRESTATIONS_SERVICES_BIC"
  | "PRESTATIONS_SERVICES_BNC";

type CategorieRevenu = "BIC" | "BNC" | "BA";

type TypeImposition = "IR" | "IS";

type RegimeTVA = "FRANCHISE_BASE" | "REEL_SIMPLIFIE" | "REEL_NORMAL";

type OrganismeRattachement =
  | "REGIME_GENERAL_SSI"
  | "CIPAV"
  | "CARPIMKO"
  | "CARMF"
  | "CARCDSF"
  | "AUTRES";

// ============================================================================
// RÉGIME FISCAL
// ============================================================================

interface SeuilsFiscaux {
  seuilBase: number;
  seuilMajore: number; // Seuil de tolérance
  description: string;
}

interface RegimeTVAConfig {
  nom: RegimeTVA;
  seuilMin: number;
  seuilMax: number | null;
  description: string;
  obligationsDeclaratives: string;
}

interface ModeleCalculBenefice {
  type: "ABATTEMENT_FORFAITAIRE" | "CHARGES_REELLES";
  tauxAbattement?: number; // Si abattement forfaitaire
  description: string;
}

interface ObligationsComptables {
  type: string;
  documents: string[];
  periodicite: string;
  modeTransmission: string[];
}

interface ObligationsDeclaratives {
  formulaires: string[];
  periodicite: string;
  dateEcheance: string;
  modeTransmission: string[];
}

interface OptionsDisponibles {
  nom: string;
  conditions: string[];
  description: string;
}

interface RegimeFiscal {
  id: string;
  nom: string;

  // Caractéristiques principales
  seuilsApplication: {
    parNatureActivite: Record<NatureActivite, SeuilsFiscaux>;
  };

  reglesDepassement: {
    toleranceN1: boolean;
    toleranceN2: boolean;
    proratisationPremiereAnnee: boolean;
    description: string;
  };

  typeImposition: TypeImposition[];

  categoriesRevenus: CategorieRevenu[];

  modeleCalculBenefice: ModeleCalculBenefice;

  regimesTVAApplicables: RegimeTVAConfig[];

  obligationsComptables: ObligationsComptables;

  obligationsDeclaratives: ObligationsDeclaratives;

  optionsDisponibles: OptionsDisponibles[];

  // Métadonnées
  sources: string[];
  dateValidite: string;
}

// ============================================================================
// RÉGIME SOCIAL
// ============================================================================

interface SeuilsSociaux {
  seuilBase: number;
  seuilMajore?: number;
  description: string;
}

interface AssietteCalcul {
  type: "CA_ENCAISSE" | "REVENU_PROFESSIONNEL" | "REVENU_BRUT_ABATTU";
  description: string;
  tauxAbattement?: number; // Pour REVENU_BRUT_ABATTU (réforme 2026)
  baseCalcul: string;
}

interface TauxCotisation {
  categorie: NatureActivite;
  tauxGlobal: number;
  repartition: {
    maladie: number;
    maladie2_IJ: number;
    retraiteBase: number;
    retraiteComplementaire: number;
    invaliditeDeces: number;
    allocationsFamiliales: number;
    csgCrds: number;
    formationProfessionnelle: number;
  };
  evolution?: {
    date: string;
    nouveauTaux: number;
  }[];
}

interface CotisationsAnnexes {
  nom: string;
  tauxParActivite: Record<NatureActivite, number>;
  description: string;
}

interface Periodicite {
  frequences: ("MENSUELLE" | "TRIMESTRIELLE" | "PROVISIONNELLE_ANNUELLE")[];
  description: string;
}

interface Exoneration {
  nom: string;
  conditions: string[];
  montantReduction: string;
  duree: string;
}

interface OptionSpecifique {
  nom: string;
  conditions: string[];
  impact: string;
}

interface ProtectionSociale {
  prestations: {
    maladie: string;
    retraiteBase: string;
    retraiteComplementaire: string;
    invaliditeDeces: string;
    maternitePaternite: string;
  };
  exclusions: string[];
  complementsRecommandes: string[];
}

interface RegimeSocial {
  id: string;
  nom: string;

  // Caractéristiques principales
  seuilsApplication: {
    parNatureActivite: Record<NatureActivite, SeuilsSociaux>;
  };

  typeRegime: "MICRO_SOCIAL" | "TNS_REEL";

  assietteCalcul: AssietteCalcul;

  tauxCotisations: TauxCotisation[];

  cotisationsAnnexes: CotisationsAnnexes[];

  periodicite: Periodicite;

  organismeRecouvrement: {
    nom: "URSSAF";
    description: string;
  };

  organismeRattachement: {
    type: OrganismeRattachement;
    professionsConcernees: string[];
    description: string;
  }[];

  exonerationsApplicables: Exoneration[];

  optionsSpecifiques: OptionSpecifique[];

  protectionSociale: ProtectionSociale;

  // Métadonnées
  sources: string[];
  dateValidite: string;
}

// ============================================================================
// DONNÉES : RÉGIMES FISCAUX
// ============================================================================

export const REGIME_FISCAL_MICRO: RegimeFiscal = {
  id: "MICRO",
  nom: "Régime Micro-Entreprise (Micro-fiscal)",

  seuilsApplication: {
    parNatureActivite: {
      VENTE_MARCHANDISES: {
        seuilBase: 188700,
        seuilMajore: 188700,
        description: "Vente de marchandises, fourniture de denrées",
      },
      HEBERGEMENT: {
        seuilBase: 188700,
        seuilMajore: 188700,
        description:
          "Fourniture de logement (hors location meublée non classée)",
      },
      PRESTATIONS_SERVICES_BIC: {
        seuilBase: 77700,
        seuilMajore: 77700,
        description:
          "Prestations de services commerciales ou artisanales (BIC)",
      },
      PRESTATIONS_SERVICES_BNC: {
        seuilBase: 77700,
        seuilMajore: 77700,
        description: "Prestations de services et activités libérales (BNC)",
      },
    },
  },

  reglesDepassement: {
    toleranceN1: true,
    toleranceN2: true,
    proratisationPremiereAnnee: true,
    description:
      "Le régime micro reste applicable tant que le CA ne dépasse pas les seuils deux années consécutives (N-1 et N-2). En année de création, le CA est proratisé sur 365 jours.",
  },

  typeImposition: ["IR"],

  categoriesRevenus: ["BIC", "BNC", "BA"],

  modeleCalculBenefice: {
    type: "ABATTEMENT_FORFAITAIRE",
    description:
      "Le bénéfice imposable est calculé après application d'un abattement forfaitaire sur le CA",
  },

  regimesTVAApplicables: [
    {
      nom: "FRANCHISE_BASE",
      seuilMin: 0,
      seuilMax: 37500, // Pour prestations de services
      description:
        "Franchise en base de TVA - Pas de TVA facturée ni récupérée",
      obligationsDeclaratives: "Aucune déclaration de TVA",
    },
  ],

  obligationsComptables: {
    type: "Simplifiées",
    documents: [
      "Livre des recettes",
      "Registre des achats (pour activités de vente)",
    ],
    periodicite: "Enregistrement chronologique",
    modeTransmission: ["Pas de transmission obligatoire"],
  },

  obligationsDeclaratives: {
    formulaires: ["2042-C-PRO"],
    periodicite: "Annuelle",
    dateEcheance: "Mai-Juin (déclaration revenus)",
    modeTransmission: ["En ligne sur impots.gouv.fr"],
  },

  optionsDisponibles: [
    {
      nom: "Versement libératoire de l'IR",
      conditions: [
        "Revenu fiscal de référence N-2 ≤ 28 797 € (pour 1 part, 2025)",
        "Option à formuler lors de la création ou avant le 30 septembre",
      ],
      description:
        "Permet de payer l'IR en même temps que les cotisations sociales avec un taux forfaitaire sur le CA",
    },
    {
      nom: "Option pour le régime réel",
      conditions: [
        "Formuler avant le 1er février de l'année",
        "Irrévocable pendant 2 ans",
      ],
      description:
        "Permet de déduire les charges réelles si elles sont supérieures à l'abattement forfaitaire",
    },
  ],

  sources: [
    "BPI France Création (2025)",
    "Service-public.fr (Janvier 2026)",
    "Code Général des Impôts",
  ],
  dateValidite: "2025-2026",
};

export const REGIME_FISCAL_REEL_SIMPLIFIE: RegimeFiscal = {
  id: "REEL_SIMPLIFIE",
  nom: "Régime Réel Simplifié",

  seuilsApplication: {
    parNatureActivite: {
      VENTE_MARCHANDISES: {
        seuilBase: 188700,
        seuilMajore: 840000,
        description: "CA entre 188 700 € et 840 000 €",
      },
      HEBERGEMENT: {
        seuilBase: 188700,
        seuilMajore: 840000,
        description: "CA entre 188 700 € et 840 000 €",
      },
      PRESTATIONS_SERVICES_BIC: {
        seuilBase: 77700,
        seuilMajore: 254000,
        description: "CA entre 77 700 € et 254 000 €",
      },
      PRESTATIONS_SERVICES_BNC: {
        seuilBase: 77700,
        seuilMajore: 254000,
        description: "CA entre 77 700 € et 254 000 €",
      },
    },
  },

  reglesDepassement: {
    toleranceN1: false,
    toleranceN2: false,
    proratisationPremiereAnnee: false,
    description:
      "Application automatique si dépassement des seuils du micro ou sur option",
  },

  typeImposition: ["IR", "IS"],

  categoriesRevenus: ["BIC", "BNC"],

  modeleCalculBenefice: {
    type: "CHARGES_REELLES",
    description:
      "Le bénéfice imposable est calculé en déduisant toutes les charges réelles de l'exercice",
  },

  regimesTVAApplicables: [
    {
      nom: "FRANCHISE_BASE",
      seuilMin: 0,
      seuilMax: 37500,
      description:
        "Franchise en base si CA HT < 37 500 € (services) ou 85 000 € (ventes)",
      obligationsDeclaratives: "Aucune",
    },
    {
      nom: "REEL_SIMPLIFIE",
      seuilMin: 37500,
      seuilMax: 254000,
      description: "Régime réel simplifié de TVA",
      obligationsDeclaratives:
        "Déclaration annuelle CA12 + acomptes semestriels",
    },
  ],

  obligationsComptables: {
    type: "Réelles simplifiées",
    documents: [
      "Livre-journal des recettes et dépenses",
      "Grand livre",
      "Livre d'inventaire",
      "Comptes annuels simplifiés",
    ],
    periodicite: "Enregistrement comptable continu",
    modeTransmission: ["Télétransmission obligatoire"],
  },

  obligationsDeclaratives: {
    formulaires: [
      "2042-C-PRO",
      "Déclaration de résultats (2031 pour BIC, 2035 pour BNC)",
      "Annexes 2033-A à 2033-G",
    ],
    periodicite: "Annuelle",
    dateEcheance: "2ème jour ouvré après le 1er mai + 15 jours",
    modeTransmission: [
      "Mode EFI (Échange de Formulaires Informatisé)",
      "Mode EDI via expert-comptable",
    ],
  },

  optionsDisponibles: [
    {
      nom: "Option pour le réel normal",
      conditions: ["Formuler avant le 1er février de l'année"],
      description:
        "Permet d'opter pour le régime réel normal même si les seuils ne sont pas atteints",
    },
    {
      nom: "Option pour l'IS",
      conditions: [
        "Disponible depuis 2022 pour les EI",
        "Assimilation à une EURL",
        "Option irrévocable sauf transformation",
      ],
      description: "Permet d'être imposé à l'IS avec un taux de 15% puis 25%",
    },
  ],

  sources: [
    "Service-public.fr (Janvier 2026)",
    "CCI Paris IDF (Septembre 2025)",
    "Code Général des Impôts",
  ],
  dateValidite: "2025-2026",
};

export const REGIME_FISCAL_REEL_NORMAL: RegimeFiscal = {
  id: "REEL_NORMAL",
  nom: "Régime Réel Normal",

  seuilsApplication: {
    parNatureActivite: {
      VENTE_MARCHANDISES: {
        seuilBase: 840000,
        seuilMajore: 999999999, // Pas de limite haute
        description: "CA > 840 000 €",
      },
      HEBERGEMENT: {
        seuilBase: 840000,
        seuilMajore: 999999999,
        description: "CA > 840 000 €",
      },
      PRESTATIONS_SERVICES_BIC: {
        seuilBase: 254000,
        seuilMajore: 999999999,
        description: "CA > 254 000 €",
      },
      PRESTATIONS_SERVICES_BNC: {
        seuilBase: 254000,
        seuilMajore: 999999999,
        description: "CA > 254 000 €",
      },
    },
  },

  reglesDepassement: {
    toleranceN1: false,
    toleranceN2: false,
    proratisationPremiereAnnee: false,
    description:
      "Application automatique dès dépassement des seuils du réel simplifié",
  },

  typeImposition: ["IR", "IS"],

  categoriesRevenus: ["BIC", "BNC"],

  modeleCalculBenefice: {
    type: "CHARGES_REELLES",
    description:
      "Comptabilité d'engagement complète avec déduction de toutes les charges réelles",
  },

  regimesTVAApplicables: [
    {
      nom: "REEL_NORMAL",
      seuilMin: 254000,
      seuilMax: null,
      description: "Régime réel normal de TVA obligatoire",
      obligationsDeclaratives:
        "Déclarations mensuelles CA3 + récapitulatif annuel",
    },
  ],

  obligationsComptables: {
    type: "Complètes",
    documents: [
      "Livre-journal",
      "Grand livre",
      "Livre d'inventaire",
      "Bilan",
      "Compte de résultat",
      "Annexes comptables",
    ],
    periodicite: "Enregistrement comptable en continu",
    modeTransmission: ["Télétransmission obligatoire via EDI"],
  },

  obligationsDeclaratives: {
    formulaires: [
      "2042-C-PRO",
      "Déclaration de résultats détaillée",
      "Liasse fiscale complète (2050 à 2059)",
      "CA3 mensuelle pour TVA",
    ],
    periodicite: "Annuelle pour l'IR, mensuelle pour la TVA",
    dateEcheance: "2ème jour ouvré après le 1er mai + 15 jours",
    modeTransmission: ["Mode EDI obligatoire"],
  },

  optionsDisponibles: [
    {
      nom: "Option pour l'IS",
      conditions: [
        "Disponible pour les EI depuis 2022",
        "Assimilation à une EURL",
      ],
      description: "Permet d'être imposé à l'IS",
    },
  ],

  sources: [
    "Service-public.fr (Janvier 2026)",
    "Shopify France (Octobre 2025)",
  ],
  dateValidite: "2025-2026",
};

// ============================================================================
// DONNÉES : RÉGIMES SOCIAUX
// ============================================================================

export const REGIME_SOCIAL_MICRO: RegimeSocial = {
  id: "MICRO_SOCIAL",
  nom: "Régime Micro-Social (Auto-entrepreneur)",

  seuilsApplication: {
    parNatureActivite: {
      VENTE_MARCHANDISES: {
        seuilBase: 188700,
        description: "CA ≤ 188 700 € pour ventes de marchandises",
      },
      HEBERGEMENT: {
        seuilBase: 188700,
        description: "CA ≤ 188 700 € pour hébergement",
      },
      PRESTATIONS_SERVICES_BIC: {
        seuilBase: 77700,
        description: "CA ≤ 77 700 € pour prestations de services BIC",
      },
      PRESTATIONS_SERVICES_BNC: {
        seuilBase: 77700,
        description: "CA ≤ 77 700 € pour prestations de services BNC",
      },
    },
  },

  typeRegime: "MICRO_SOCIAL",

  assietteCalcul: {
    type: "CA_ENCAISSE",
    description:
      "Cotisations calculées sur le chiffre d'affaires réellement encaissé",
    baseCalcul: "Chiffre d'affaires déclaré mensuellement ou trimestriellement",
  },

  tauxCotisations: [
    {
      categorie: "VENTE_MARCHANDISES",
      tauxGlobal: 13.4,
      repartition: {
        maladie: 3.15,
        maladie2_IJ: 0.5,
        retraiteBase: 6.0,
        retraiteComplementaire: 2.55,
        invaliditeDeces: 0.35,
        allocationsFamiliales: 0.45,
        csgCrds: 9.7,
        formationProfessionnelle: 0.1,
      },
    },
    {
      categorie: "PRESTATIONS_SERVICES_BIC",
      tauxGlobal: 22.2,
      repartition: {
        maladie: 5.2,
        maladie2_IJ: 0.85,
        retraiteBase: 9.95,
        retraiteComplementaire: 4.2,
        invaliditeDeces: 0.6,
        allocationsFamiliales: 0.6,
        csgCrds: 9.7,
        formationProfessionnelle: 0.2,
      },
    },
    {
      categorie: "PRESTATIONS_SERVICES_BNC",
      tauxGlobal: 24.6,
      repartition: {
        maladie: 5.65,
        maladie2_IJ: 0.95,
        retraiteBase: 10.85,
        retraiteComplementaire: 4.55,
        invaliditeDeces: 0.65,
        allocationsFamiliales: 0.65,
        csgCrds: 9.7,
        formationProfessionnelle: 0.2,
      },
      evolution: [
        {
          date: "2025-01-01",
          nouveauTaux: 24.6,
        },
        {
          date: "2026-01-01",
          nouveauTaux: 26.1,
        },
      ],
    },
    {
      categorie: "HEBERGEMENT",
      tauxGlobal: 6.0,
      repartition: {
        maladie: 1.5,
        maladie2_IJ: 0.25,
        retraiteBase: 3.0,
        retraiteComplementaire: 1.25,
        invaliditeDeces: 0.17,
        allocationsFamiliales: 0.2,
        csgCrds: 9.7,
        formationProfessionnelle: 0.1,
      },
    },
  ],

  cotisationsAnnexes: [
    {
      nom: "Contribution Formation Professionnelle (CFP)",
      tauxParActivite: {
        VENTE_MARCHANDISES: 0.1,
        HEBERGEMENT: 0.1,
        PRESTATIONS_SERVICES_BIC: 0.2,
        PRESTATIONS_SERVICES_BNC: 0.2,
      },
      description: "Contribution obligatoire pour le droit à la formation",
    },
    {
      nom: "Taxe pour frais de chambres (TFC)",
      tauxParActivite: {
        VENTE_MARCHANDISES: 0.015,
        HEBERGEMENT: 0.007,
        PRESTATIONS_SERVICES_BIC: 0.48,
        PRESTATIONS_SERVICES_BNC: 0.0,
      },
      description:
        "Taxe consulaire variable selon l'activité et la zone géographique",
    },
  ],

  periodicite: {
    frequences: ["MENSUELLE", "TRIMESTRIELLE"],
    description:
      "Choix entre déclaration mensuelle ou trimestrielle du CA, avec paiement des cotisations au moment de la déclaration",
  },

  organismeRecouvrement: {
    nom: "URSSAF",
    description:
      "Unique organisme collecteur pour tous les micro-entrepreneurs depuis 2023",
  },

  organismeRattachement: [
    {
      type: "REGIME_GENERAL_SSI",
      professionsConcernees: [
        "Artisans",
        "Commerçants",
        "Professions libérales non réglementées",
        "Prestations de services BIC",
      ],
      description:
        "Rattachement à la CARSAT (ou CNAV en Île-de-France) pour la retraite complémentaire",
    },
    {
      type: "CIPAV",
      professionsConcernees: [
        "Architectes",
        "Ingénieurs-conseil",
        "Moniteurs de ski",
        "Ostéopathes",
        "Psychologues",
        "Ergothérapeutes",
        "+ 12 autres professions libérales réglementées",
      ],
      description:
        "Rattachement à la CIPAV pour 18 professions libérales réglementées spécifiques",
    },
  ],

  exonerationsApplicables: [
    {
      nom: "ACRE (Aide à la Création ou Reprise d'Entreprise)",
      conditions: [
        "Première année d'activité",
        "Pas d'ACRE dans les 3 dernières années",
        "Demande à formuler lors de l'immatriculation ou dans les 45 jours",
      ],
      montantReduction: "50% de réduction sur les cotisations sociales",
      duree: "12 mois",
    },
  ],

  optionsSpecifiques: [
    {
      nom: "Versement libératoire de l'IR",
      conditions: [
        "Revenu fiscal de référence N-2 ≤ 28 797 € (1 part)",
        "Option combinée fiscal + social",
      ],
      impact:
        "Paiement simultané de l'IR et des cotisations sociales avec un taux global sur le CA",
    },
    {
      nom: "Cotisations minimales",
      conditions: ["CA faible ou nul", "Demande par courrier à l'URSSAF"],
      impact:
        "Sortie du micro-social vers le régime TNS réel avec cotisations minimales pour garantir une meilleure protection",
    },
  ],

  protectionSociale: {
    prestations: {
      maladie: "Remboursement identique au régime général",
      retraiteBase:
        "Trimestres validés selon le CA (ex: 24 104 € pour 4 trimestres en vente)",
      retraiteComplementaire:
        "Points acquis proportionnellement aux cotisations",
      invaliditeDeces: "Pension d'invalidité et capital décès selon revenus",
      maternitePaternite:
        "Indemnités journalières forfaitaires et allocation forfaitaire de repos maternel",
    },
    exclusions: [
      "Pas d'assurance chômage",
      "Pas de couverture accident du travail",
    ],
    complementsRecommandes: [
      "Mutuelle santé complémentaire",
      "Prévoyance invalidité/décès",
      "Assurance accident du travail volontaire",
    ],
  },

  sources: [
    "LégiSocial (Janvier 2025)",
    "URSSAF (2025)",
    "Ministère de l'Économie (2024)",
    "Lecoindesentrepreneurs (Octobre 2024)",
  ],
  dateValidite: "2025-2026",
};

export const REGIME_SOCIAL_TNS_REEL: RegimeSocial = {
  id: "TNS_REEL",
  nom: "Régime Réel des Travailleurs Non Salariés (TNS)",

  seuilsApplication: {
    parNatureActivite: {
      VENTE_MARCHANDISES: {
        seuilBase: 188700,
        description: "CA > 188 700 € ou option pour le régime réel",
      },
      HEBERGEMENT: {
        seuilBase: 188700,
        description: "CA > 188 700 € ou option pour le régime réel",
      },
      PRESTATIONS_SERVICES_BIC: {
        seuilBase: 77700,
        description: "CA > 77 700 € ou option pour le régime réel",
      },
      PRESTATIONS_SERVICES_BNC: {
        seuilBase: 77700,
        description: "CA > 77 700 € ou option pour le régime réel",
      },
    },
  },

  typeRegime: "TNS_REEL",

  assietteCalcul: {
    type: "REVENU_BRUT_ABATTU",
    description:
      "Cotisations calculées sur le revenu professionnel (bénéfice) abattu de 26%",
    tauxAbattement: 26,
    baseCalcul:
      "Revenu professionnel imposable déclaré aux impôts, avec abattement forfaitaire de 26% (réforme 2026)",
  },

  tauxCotisations: [
    {
      categorie: "VENTE_MARCHANDISES",
      tauxGlobal: 45.0, // Estimation globale
      repartition: {
        maladie: 8.5,
        maladie2_IJ: 0.85,
        retraiteBase: 17.75,
        retraiteComplementaire: 7.0,
        invaliditeDeces: 1.3,
        allocationsFamiliales: 3.1,
        csgCrds: 9.7,
        formationProfessionnelle: 0.25,
      },
    },
    {
      categorie: "PRESTATIONS_SERVICES_BIC",
      tauxGlobal: 45.0,
      repartition: {
        maladie: 8.5,
        maladie2_IJ: 0.85,
        retraiteBase: 17.75,
        retraiteComplementaire: 7.0,
        invaliditeDeces: 1.3,
        allocationsFamiliales: 3.1,
        csgCrds: 9.7,
        formationProfessionnelle: 0.25,
      },
    },
    {
      categorie: "PRESTATIONS_SERVICES_BNC",
      tauxGlobal: 45.0,
      repartition: {
        maladie: 8.5,
        maladie2_IJ: 0.85,
        retraiteBase: 17.75,
        retraiteComplementaire: 7.0,
        invaliditeDeces: 1.3,
        allocationsFamiliales: 3.1,
        csgCrds: 9.7,
        formationProfessionnelle: 0.25,
      },
    },
    {
      categorie: "HEBERGEMENT",
      tauxGlobal: 45.0,
      repartition: {
        maladie: 8.5,
        maladie2_IJ: 0.85,
        retraiteBase: 17.75,
        retraiteComplementaire: 7.0,
        invaliditeDeces: 1.3,
        allocationsFamiliales: 3.1,
        csgCrds: 9.7,
        formationProfessionnelle: 0.25,
      },
    },
  ],

  cotisationsAnnexes: [
    {
      nom: "Contribution Formation Professionnelle (CFP)",
      tauxParActivite: {
        VENTE_MARCHANDISES: 0.25,
        HEBERGEMENT: 0.25,
        PRESTATIONS_SERVICES_BIC: 0.25,
        PRESTATIONS_SERVICES_BNC: 0.25,
      },
      description:
        "CFP forfaitaire : 118€ pour commerçants/PL, 137€ pour artisans, 160€ avec conjoint collaborateur (2025)",
    },
  ],

  periodicite: {
    frequences: ["PROVISIONNELLE_ANNUELLE"],
    description:
      "Cotisations provisionnelles mensuelles ou trimestrielles basées sur les revenus N-2, avec régularisation annuelle après déclaration fiscale",
  },

  organismeRecouvrement: {
    nom: "URSSAF",
    description:
      "Unique organisme collecteur pour tous les travailleurs indépendants depuis 2023",
  },

  organismeRattachement: [
    {
      type: "REGIME_GENERAL_SSI",
      professionsConcernees: [
        "Artisans",
        "Commerçants",
        "Professions libérales non réglementées",
      ],
      description:
        "Rattachement à la CARSAT (ou CNAV en Île-de-France) pour la retraite",
    },
    {
      type: "CIPAV",
      professionsConcernees: [
        "18 professions libérales réglementées (architectes, ingénieurs-conseil, moniteurs de ski, ostéopathes, psychologues, etc.)",
      ],
      description:
        "Rattachement à la CIPAV pour les professions libérales réglementées",
    },
    {
      type: "CARPIMKO",
      professionsConcernees: [
        "Infirmiers",
        "Masseurs-kinésithérapeutes",
        "Pédicures-podologues",
        "Orthophonistes",
        "Orthoptistes",
      ],
      description: "Caisse spécifique pour les professions paramédicales",
    },
    {
      type: "CARMF",
      professionsConcernees: ["Médecins"],
      description: "Caisse spécifique pour les médecins",
    },
    {
      type: "CARCDSF",
      professionsConcernees: ["Chirurgiens-dentistes", "Sages-femmes"],
      description:
        "Caisse spécifique pour les chirurgiens-dentistes et sages-femmes",
    },
    {
      type: "AUTRES",
      professionsConcernees: [
        "CAVP (pharmaciens)",
        "CARPV (vétérinaires)",
        "CAVEC (experts-comptables)",
        "CAVOM (officiers ministériels)",
        "etc.",
      ],
      description: "Autres caisses professionnelles selon la profession",
    },
  ],

  exonerationsApplicables: [
    {
      nom: "ACRE (Aide à la Création ou Reprise d'Entreprise)",
      conditions: [
        "Deux premières années d'activité",
        "Exonération sur revenus < 47 100 € (1 PASS)",
        "Exonération dégressive entre 47 100 € et 58 875 €",
      ],
      montantReduction:
        "Exonération partielle des cotisations maladie, maternité, retraite de base, invalidité-décès, allocations familiales",
      duree: "24 mois",
    },
    {
      nom: "Exonération JEI/JEU (Jeune Entreprise Innovante/Universitaire)",
      conditions: [
        "Entreprise de moins de 8 ans",
        "Dépenses de R&D ≥ 15% des charges",
        "PME au sens communautaire",
      ],
      montantReduction:
        "Exonération de cotisations patronales sur les rémunérations",
      duree: "7 ans (100% puis dégressif)",
    },
    {
      nom: "Exonération ZFU (Zone Franche Urbaine)",
      conditions: [
        "Activité créée entre 2016 et 2025",
        "Implantation en ZFU",
        "Conditions d'effectif et de CA",
      ],
      montantReduction: "Exonération totale puis dégressive",
      duree: "5 ans",
    },
  ],

  optionsSpecifiques: [],

  protectionSociale: {
    prestations: {
      maladie: "Remboursement identique au régime général",
      retraiteBase:
        "Validation de trimestres selon cotisations versées (min 150h SMIC pour 1 trimestre)",
      retraiteComplementaire:
        "Points acquis proportionnellement aux cotisations",
      invaliditeDeces:
        "Pension d'invalidité selon revenus, capital décès pour ayants droit",
      maternitePaternite:
        "Indemnités journalières proportionnelles aux revenus (max 64,52€/jour ou 193,56€ pour CIPAV)",
    },
    exclusions: [
      "Pas d'assurance chômage",
      "Pas de couverture accident du travail automatique",
    ],
    complementsRecommandes: [
      "Mutuelle santé (déductible loi Madelin)",
      "Contrat prévoyance invalidité/décès (déductible loi Madelin)",
      "Contrat retraite complémentaire facultatif (déductible loi Madelin)",
      "Assurance chômage privée",
      "Assurance accident du travail",
    ],
  },

  sources: [
    "URSSAF (2025)",
    "Service-public.fr (Janvier 2026)",
    "Agiris (Décembre 2025)",
    "Legalplace (Avril 2025)",
  ],
  dateValidite: "2025-2026",
};

// ============================================================================
// EXPORTS GROUPÉS
// ============================================================================

export const REGIMES_FISCAUX = {
  MICRO: REGIME_FISCAL_MICRO,
  REEL_SIMPLIFIE: REGIME_FISCAL_REEL_SIMPLIFIE,
  REEL_NORMAL: REGIME_FISCAL_REEL_NORMAL,
} as const;

export const REGIMES_SOCIAUX = {
  MICRO_SOCIAL: REGIME_SOCIAL_MICRO,
  TNS_REEL: REGIME_SOCIAL_TNS_REEL,
} as const;

// ============================================================================
// FONCTIONS UTILITAIRES
// ============================================================================

/**
 * Détermine le régime fiscal applicable selon le CA et la nature d'activité
 */
export function determinerRegimeFiscal(
  ca: number,
  natureActivite: NatureActivite,
  optionReelVolontaire: boolean = false,
):
  | typeof REGIME_FISCAL_MICRO
  | typeof REGIME_FISCAL_REEL_SIMPLIFIE
  | typeof REGIME_FISCAL_REEL_NORMAL {
  if (optionReelVolontaire) {
    // Si option pour le réel, déterminer quel réel
    const seuilReelNormal =
      natureActivite === "VENTE_MARCHANDISES" ||
      natureActivite === "HEBERGEMENT"
        ? 840000
        : 254000;

    return ca > seuilReelNormal
      ? REGIME_FISCAL_REEL_NORMAL
      : REGIME_FISCAL_REEL_SIMPLIFIE;
  }

  // Détermination automatique
  const seuilMicro =
    natureActivite === "VENTE_MARCHANDISES" || natureActivite === "HEBERGEMENT"
      ? 188700
      : 77700;

  const seuilReelNormal =
    natureActivite === "VENTE_MARCHANDISES" || natureActivite === "HEBERGEMENT"
      ? 840000
      : 254000;

  if (ca <= seuilMicro) {
    return REGIME_FISCAL_MICRO;
  } else if (ca <= seuilReelNormal) {
    return REGIME_FISCAL_REEL_SIMPLIFIE;
  } else {
    return REGIME_FISCAL_REEL_NORMAL;
  }
}

/**
 * Détermine le régime social applicable selon le CA
 */
export function determinerRegimeSocial(
  ca: number,
  natureActivite: NatureActivite,
  optionCotisationsMinimales: boolean = false,
): typeof REGIME_SOCIAL_MICRO | typeof REGIME_SOCIAL_TNS_REEL {
  if (optionCotisationsMinimales) {
    return REGIME_SOCIAL_TNS_REEL;
  }

  const seuilMicro =
    natureActivite === "VENTE_MARCHANDISES" || natureActivite === "HEBERGEMENT"
      ? 188700
      : 77700;

  return ca <= seuilMicro ? REGIME_SOCIAL_MICRO : REGIME_SOCIAL_TNS_REEL;
}

/**
 * Calcule le taux d'abattement forfaitaire pour le régime micro
 */
export function obtenirTauxAbattement(natureActivite: NatureActivite): number {
  const tauxAbattements: Record<NatureActivite, number> = {
    VENTE_MARCHANDISES: 71,
    HEBERGEMENT: 71,
    PRESTATIONS_SERVICES_BIC: 50,
    PRESTATIONS_SERVICES_BNC: 34,
  };

  return tauxAbattements[natureActivite];
}

/**
 * Obtient le taux de cotisations sociales pour le régime micro-social
 */
export function obtenirTauxCotisationsMicroSocial(
  natureActivite: NatureActivite,
): number {
  const tauxCotisation = REGIME_SOCIAL_MICRO.tauxCotisations.find(
    (tc) => tc.categorie === natureActivite,
  );

  return tauxCotisation?.tauxGlobal ?? 0;
}
