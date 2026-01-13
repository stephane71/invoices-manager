# Modèle de Données - Régimes Fiscal et Social

Modèle de données complet pour simuler les régimes fiscal et social des Entreprises Individuelles (EI) en France.

## 📋 Vue d'ensemble

Ce modèle couvre **3 régimes fiscaux** et **2 régimes sociaux** avec toutes leurs caractéristiques, basé sur les réglementations 2025-2026.

### Régimes Fiscaux
- ✅ **Régime Micro-Entreprise** (CA ≤ 77 700 € ou 188 700 €)
- ✅ **Régime Réel Simplifié** (CA entre les seuils micro et réel normal)
- ✅ **Régime Réel Normal** (CA > 254 000 € ou 840 000 €)

### Régimes Sociaux
- ✅ **Régime Micro-Social** (Auto-entrepreneur)
- ✅ **Régime TNS Réel** (Travailleur Non Salarié)

## 🎯 Caractéristiques modélisées

### Pour les Régimes Fiscaux

| Caractéristique | Description |
|-----------------|-------------|
| **Seuils d'application** | Par nature d'activité (vente, hébergement, services BIC/BNC) |
| **Règles de dépassement** | Tolérance N-1/N-2, proratisation première année |
| **Type d'imposition** | IR (Impôt sur le Revenu) ou IS (Impôt sur les Sociétés) |
| **Catégories de revenus** | BIC, BNC, BA |
| **Mode de calcul bénéfice** | Abattement forfaitaire vs charges réelles |
| **Régimes TVA** | Franchise, Réel simplifié, Réel normal |
| **Obligations comptables** | Documents, périodicité, transmission |
| **Obligations déclaratives** | Formulaires, échéances, modalités |
| **Options disponibles** | Versement libératoire, option réel, etc. |

### Pour les Régimes Sociaux

| Caractéristique | Description |
|-----------------|-------------|
| **Seuils d'application** | Par nature d'activité |
| **Type de régime** | Micro-social ou TNS réel |
| **Assiette de calcul** | CA encaissé, revenu professionnel, ou revenu brut abattu (26%) |
| **Taux de cotisations** | Taux global + répartition détaillée par poste |
| **Cotisations annexes** | CFP, Taxe chambres consulaires |
| **Périodicité** | Mensuelle, trimestrielle, ou provisionnelle |
| **Organisme recouvrement** | URSSAF (unique collecteur depuis 2023) |
| **Organisme rattachement** | Régime général, CIPAV, CARPIMKO, etc. |
| **Exonérations** | ACRE, ZFU, JEI/JEU |
| **Options spécifiques** | Versement libératoire, cotisations minimales |
| **Protection sociale** | Prestations, exclusions, compléments recommandés |

## 📊 Structure des données

### Types de base

```typescript
type NatureActivite = 
  | 'VENTE_MARCHANDISES' 
  | 'HEBERGEMENT' 
  | 'PRESTATIONS_SERVICES_BIC' 
  | 'PRESTATIONS_SERVICES_BNC';

type CategorieRevenu = 'BIC' | 'BNC' | 'BA';

type TypeImposition = 'IR' | 'IS';

type RegimeTVA = 'FRANCHISE_BASE' | 'REEL_SIMPLIFIE' | 'REEL_NORMAL';

type OrganismeRattachement = 
  | 'REGIME_GENERAL_SSI' 
  | 'CIPAV' 
  | 'CARPIMKO' 
  | 'CARMF' 
  | 'CARCDSF' 
  | 'AUTRES';
```

### Interfaces principales

```typescript
interface RegimeFiscal {
  id: string;
  nom: string;
  seuilsApplication: {...};
  reglesDepassement: {...};
  typeImposition: TypeImposition[];
  categoriesRevenus: CategorieRevenu[];
  modeleCalculBenefice: {...};
  regimesTVAApplicables: [...];
  obligationsComptables: {...};
  obligationsDeclaratives: {...};
  optionsDisponibles: [...];
  sources: string[];
  dateValidite: string;
}

interface RegimeSocial {
  id: string;
  nom: string;
  seuilsApplication: {...};
  typeRegime: 'MICRO_SOCIAL' | 'TNS_REEL';
  assietteCalcul: {...};
  tauxCotisations: [...];
  cotisationsAnnexes: [...];
  periodicite: {...};
  organismeRecouvrement: {...};
  organismeRattachement: [...];
  exonerationsApplicables: [...];
  optionsSpecifiques: [...];
  protectionSociale: {...};
  sources: string[];
  dateValidite: string;
}
```

## 🚀 Utilisation

### Import

```typescript
import {
  REGIMES_FISCAUX,
  REGIMES_SOCIAUX,
  determinerRegimeFiscal,
  determinerRegimeSocial,
  obtenirTauxAbattement,
  obtenirTauxCotisationsMicroSocial
} from './modele-regimes';
```

### Exemple simple

```typescript
// Données utilisateur
const ca = 45000;
const natureActivite = 'PRESTATIONS_SERVICES_BNC';

// Détermination automatique des régimes
const regimeFiscal = determinerRegimeFiscal(ca, natureActivite);
const regimeSocial = determinerRegimeSocial(ca, natureActivite);

console.log(regimeFiscal.nom);  // "Régime Micro-Entreprise"
console.log(regimeSocial.nom);  // "Régime Micro-Social"

// Calcul du bénéfice imposable
const tauxAbattement = obtenirTauxAbattement(natureActivite);
const beneficeImposable = ca * (1 - tauxAbattement / 100);

// Calcul des cotisations sociales
const tauxCotisations = obtenirTauxCotisationsMicroSocial(natureActivite);
const cotisations = ca * (tauxCotisations / 100);
```

### Accès aux données détaillées

```typescript
// Accéder à un régime fiscal spécifique
const regimeMicro = REGIMES_FISCAUX.MICRO;

console.log(regimeMicro.obligationsComptables.documents);
// ["Livre des recettes", "Registre des achats"]

console.log(regimeMicro.optionsDisponibles[0].nom);
// "Versement libératoire de l'IR"

// Accéder aux cotisations sociales détaillées
const regimeMicroSocial = REGIMES_SOCIAUX.MICRO_SOCIAL;

const tauxBNC = regimeMicroSocial.tauxCotisations.find(
  tc => tc.categorie === 'PRESTATIONS_SERVICES_BNC'
);

console.log(tauxBNC.tauxGlobal);  // 24.6
console.log(tauxBNC.repartition.retraiteBase);  // 10.85
```

### Vérification d'éligibilité ACRE

```typescript
const regimeSocial = REGIMES_SOCIAUX.MICRO_SOCIAL;
const acre = regimeSocial.exonerationsApplicables.find(
  e => e.nom.includes('ACRE')
);

console.log(acre.conditions);
// Affiche les conditions d'éligibilité

console.log(acre.montantReduction);
// "50% de réduction sur les cotisations sociales"
```

### Comparaison micro vs réel

```typescript
const ca = 60000;
const chargesReelles = 25000;
const natureActivite = 'PRESTATIONS_SERVICES_BNC';

// Option Micro
const tauxAbattement = obtenirTauxAbattement(natureActivite);
const beneficeMicro = ca * (1 - tauxAbattement / 100);

// Option Réel
const beneficeReel = ca - chargesReelles;

// Recommandation
if (beneficeReel < beneficeMicro) {
  console.log('Le régime RÉEL est plus avantageux');
} else {
  console.log('Le régime MICRO est plus avantageux');
}
```

## 📈 Cas d'usage

### 1. Simulateur en ligne
Créer un outil interactif permettant aux entrepreneurs de :
- Saisir leur CA prévisionnel et nature d'activité
- Voir automatiquement les régimes applicables
- Comparer les options fiscales et sociales
- Calculer le revenu net disponible

### 2. Outil d'aide à la décision
Comparer différents scénarios :
- Micro vs Réel selon le niveau de charges
- Impact de l'ACRE la première année
- Évolution sur 3 ans avec augmentation du CA
- Choix entre IR et IS

### 3. Module de calcul pour comptables
Intégrer dans un logiciel métier pour :
- Calculer automatiquement les cotisations
- Générer les déclarations
- Alerter sur les changements de régime
- Suivre les échéances

### 4. API de calculs fiscaux/sociaux
Exposer les calculs via API pour :
- Applications mobiles
- Plateformes de gestion
- Services de conseil en ligne

## 📚 Sources officielles

Toutes les données sont issues de sources officielles 2025-2026 :

- **Service-public.fr** (Janvier 2026)
- **URSSAF** (2025)
- **BPI France Création** (2025)
- **Ministère de l'Économie** (2024-2025)
- **Code Général des Impôts**
- **LégiSocial** (Janvier 2025)
- **Legifrance** (décrets 2024-2025)

## ⚠️ Notes importantes

### Limitations
- **TVA** : Modèle simplifié, ne couvre pas tous les cas particuliers
- **IS** : Traité de façon basique, nécessite approfondissement pour une vraie simulation
- **Professions réglementées** : Liste des 18 professions CIPAV complète, mais autres caisses (CARPIMKO, CARMF, etc.) simplifiées
- **Réforme 2026** : Prise en compte de la réforme de l'assiette sociale (abattement 26%)

### Points d'attention
1. Les taux évoluent régulièrement → vérifier les mises à jour annuelles
2. Certains cas particuliers ne sont pas couverts (multi-activités, régimes spéciaux, etc.)
3. Les simulations sont indicatives, ne remplacent pas un conseil personnalisé

### Évolutions prévues
- **2026** : Application de la réforme de l'assiette sociale (revenu brut abattu de 26%)
- **TVA** : Nouveau seuil unique de franchise à 25 000 € (suspendu, en cours de révision)

## 🔄 Maintenance

### Comment mettre à jour
1. Vérifier les nouveaux taux chaque année (généralement publiés fin décembre)
2. Mettre à jour les constantes dans les objets `REGIME_FISCAL_*` et `REGIME_SOCIAL_*`
3. Ajouter des entrées dans `evolution` si changements progressifs
4. Mettre à jour `dateValidite`
5. Ajouter les nouvelles sources

### Checklist annuelle
- [ ] Seuils de CA pour micro-entreprise
- [ ] Taux de cotisations sociales (micro-social et TNS)
- [ ] Taux d'abattement forfaitaire
- [ ] Seuils TVA
- [ ] Montants PASS (Plafond Annuel Sécurité Sociale)
- [ ] Conditions ACRE
- [ ] Liste des professions CIPAV

## 🤝 Contribution

Pour améliorer ce modèle :
1. Vérifier les sources officielles
2. Documenter les changements
3. Ajouter des tests pour les cas limites
4. Mettre à jour les exemples

## 📄 Licence

Ce modèle de données est fourni à des fins éducatives et de développement.
Les données proviennent de sources publiques officielles françaises.

---

**Dernière mise à jour** : Janvier 2026  
**Version** : 1.0  
**Compatible avec** : Réglementation française 2025-2026
