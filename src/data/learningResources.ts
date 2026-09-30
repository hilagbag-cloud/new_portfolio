export interface ExternalResourceLink {
  type: string;
  source: string;
  url: string;
  label: string;
}

export interface LearningSection {
  id: string;
  themeNumber: string;
  title: string;
  description: string;
  keyPoints?: string[];
  codeSnippet?: {
    language: string;
    code: string;
    title: string;
  };
  links?: ExternalResourceLink[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: { key: string; label: string }[];
  correctKey: string;
  explanation: string;
}

export interface LearningResource {
  id: string;
  title: string;
  subtitle: string;
  miniDescription: string;
  category: string;
  type: "pdf" | "book" | "file" | "text" | "image";
  coverColor: string; // Background color for cover
  coverTextColor?: string;
  accentColor?: string;
  badge: string;
  readTime: string;
  viewsCount: number;
  downloadCount: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  sections: LearningSection[];
  quiz?: QuizQuestion[];
  objectives?: string[];

  // Imported File & Download Attachment
  fileName?: string;
  fileSize?: number;
  fileSizeFormatted?: string;
  fileType?: string;
  fileDataUrl?: string;
  fileUrl?: string;
  fileContentText?: string;
  hasChunks?: boolean;
  chunksCount?: number;
}

export const defaultLearningResources: LearningResource[] = [
  {
    id: "day06-c-pool-pointers-strings-criterion",
    title: "Pointeurs, Manipulation de Chaînes & Tests Unitaires Criterion",
    subtitle: "Guide d'apprentissage renforcé avec ressources interactives, schémas mémoire et exercices pratiques.",
    miniDescription:
      "Support de cours complet (Day06 C Pool) couvrant les tests unitaires Criterion avec couverture de code (gcov), la manipulation de chaînes (strcpy, strncpy, revstr), la recherche lexicographique (strstr, strcmp) et QCM de validation.",
    category: "Programmation C & Algorithmes",
    type: "pdf",
    coverColor: "#0f2b48", // Bleu profond élégant
    coverTextColor: "#ffffff",
    accentColor: "#38bdf8",
    badge: "DAY06 · C POOL",
    readTime: "25 min de lecture",
    viewsCount: 142,
    downloadCount: 48,
    published: true,
    createdAt: "2026-09-28T12:00:00.000Z",
    updatedAt: "2026-09-28T12:00:00.000Z",
    objectives: [
      "Tests Unitaires et Couverture de Code avec Criterion (Validation automatique, métriques gcov/gcovr).",
      "Copie et Inversion de Chaînes via Pointeurs (my_strcpy, my_strncpy, my_revstr).",
      "Recherche et Comparaison Lexicographique (my_strstr, my_strcmp, my_strncmp).",
    ],
    sections: [
      {
        id: "theme-1-criterion",
        themeNumber: "Thématique 1",
        title: "Tests Unitaires et Couverture de Code (Criterion & Coverage)",
        description:
          "Dans le cadre des projets industriels et académiques en C (comme le C Pool), la fiabilité du code est assurée par des tests unitaires isolés. Plutôt que de multiplier les fonctions main() temporaires, on utilise le framework d'assertion automatisé Criterion.",
        keyPoints: [
          "En-tête indispensable : #include <criterion/criterion.h>",
          "Syntaxe d'un test : Test(nom_suite, nom_test) { ... }",
          "Assertions courantes : cr_assert_str_eq(actuel, attendu), cr_assert_eq(val1, val2)",
          "Couverture de Code (Line & Branch Coverage) : Mesurée via gcov / gcovr. Le sujet Day06 exige une couverture de ligne minimale (60% à 100%) et de branche (40% à 80%) selon les tâches.",
        ],
        codeSnippet: {
          language: "c",
          title: "Exemple de test unitaire pour my_strncpy avec Criterion",
          code: `// Exemple de test unitaire pour my_strncpy avec Criterion
#include <criterion/criterion.h>
#include <string.h>

char *my_strncpy(char *dest, char const *src, int n);

Test(my_strncpy, copy_five_characters) {
    char dest[10] = {0};
    my_strncpy(dest, "HelloWorld", 5);
    cr_assert_str_eq(dest, "Hello");
}

Test(my_strncpy, compare_with_standard_libc) {
    char my_dest[10] = {0};
    char std_dest[10] = {0};
    my_strncpy(my_dest, "Code", 6);
    strncpy(std_dest, "Code", 6);
    cr_assert_str_eq(my_dest, std_dest);
}`,
        },
        links: [
          {
            type: "Doc Officielle",
            source: "Criterion Documentation (ReadTheDocs)",
            url: "https://criterion.readthedocs.io",
            label: "Visiter la Doc Criterion",
          },
          {
            type: "Tutoriel Web",
            source: "GeeksforGeeks : Unit Testing in C",
            url: "https://www.geeksforgeeks.org/unit-testing-in-c/",
            label: "Lire le Guide GeeksforGeeks",
          },
          {
            type: "Vidéo YouTube",
            source: "YouTube : Tests Unitaires avec Criterion",
            url: "https://www.youtube.com/results?search_query=unit+testing+c+criterion",
            label: "Regarder la Vidéo (YouTube)",
          },
          {
            type: "Guide Technique",
            source: "GCC & Gcov Code Coverage Tutorial",
            url: "https://gcc.gnu.org/onlinedocs/gcc/Gcov.html",
            label: "Doc Officielle Gcov",
          },
        ],
      },
      {
        id: "theme-2-string-pointers",
        themeNumber: "Thématique 2",
        title: "Copie et Inversion de Chaînes via Pointeurs (strcpy, strncpy, revstr)",
        description:
          "La manipulation de chaînes de caractères en C repose sur la notion de pointeur sur octet (char *) et la détection du caractère nul '\\0' (ASCII 0) marquant la fin de la chaîne.",
        keyPoints: [
          "my_strcpy(dest, src) : Copie chaque caractère de src vers dest jusqu'à copier le caractère '\\0' inclus. Renvoie le pointeur dest.",
          "my_strncpy(dest, src, n) : Copie au maximum n octets. Attention au comportement spécifique : Si n > strlen(src), on complète avec des '\\0'. Si n <= strlen(src), aucun '\\0' n'est ajouté à la fin de dest !",
          "my_revstr(str) : Inverse la chaîne in-place (directement en mémoire) à l'aide de deux pointeurs (un au début, un à la fin) qui se rapprochent tout en permutant les octets.",
        ],
        codeSnippet: {
          language: "c",
          title: "Implémentation robuste de my_revstr (Inversion in-place via pointeurs)",
          code: `// Implémentation robuste de my_revstr (Inversion in-place via pointeurs)
char *my_revstr(char *str)
{
    int len = 0;
    while (str[len] != '\\0') {
        len++;
    }
    int left = 0;
    int right = len - 1;
    while (left < right) {
        char temp = str[left];
        str[left] = str[right];
        str[right] = temp;
        left++;
        right--;
    }
    return str;
}`,
        },
        links: [
          {
            type: "Vidéo YouTube",
            source: "Portfolio Courses : strcpy() & strncpy() in C",
            url: "https://www.youtube.com/results?search_query=strcpy+strncpy+c+portfolio+courses",
            label: "Voir le cours strcpy/strncpy (YouTube)",
          },
          {
            type: "Vidéo YouTube",
            source: "C String Functions (strlen, strcpy, strcmp)",
            url: "https://www.youtube.com/results?search_query=c+string+functions+strlen+strcpy+strcmp",
            label: "Voir la vidéo C String Functions",
          },
          {
            type: "Guide Web",
            source: "Aticleworld : C String Manipulations & Pointers",
            url: "https://aticleworld.com/string-in-c-programming/",
            label: "Consulter le tutoriel Aticleworld",
          },
          {
            type: "Documentation",
            source: "Creference.com : manual",
            url: "https://en.cppreference.com/w/c/string/byte",
            label: "Doc Officielle C Byte Strings",
          },
        ],
      },
      {
        id: "theme-3-lexicography",
        themeNumber: "Thématique 3",
        title: "Recherche et Comparaison Lexicographique (strstr, strcmp, strncmp)",
        description:
          "La comparaison lexicographique et la recherche de sous-chaînes s'appuient sur l'ordre ASCII des caractères et le calcul de différences algébriques entre octets pointeur par pointeur.",
        keyPoints: [
          "my_strcmp(s1, s2) : Parcourt simultanément s1 et s2. Renvoie (unsigned char)s1[i] - (unsigned char)s2[i] dès la première différence. Si la valeur retournée est < 0, s1 précède s2 dans l'ordre alphabétique ; si 0, les chaînes sont identiques.",
          "my_strncmp(s1, s2, n) : Identique à strcmp, mais s'arrête au plus tard après n octets comparés.",
          "my_strstr(str, to_find) : Cherche la première occurrence de la sous-chaîne to_find dans str. Si to_find est vide, renvoie str. Si trouvée, renvoie un pointeur vers le début de la correspondance dans str. Sinon, renvoie NULL (ou 0).",
        ],
        codeSnippet: {
          language: "c",
          title: "Implémentation algorithmique de my_strstr",
          code: `// Implémentation algorithmique de my_strstr
char *my_strstr(char *str, char const *to_find)
{
    if (to_find[0] == '\\0')
        return str;
    for (int i = 0; str[i] != '\\0'; i++) {
        int j = 0;
        while (str[i + j] != '\\0' && str[i + j] == to_find[j]) {
            j++;
            if (to_find[j] == '\\0')
                return &str[i]; // Retourne l'adresse dans str
        }
    }
    return 0; // NULL
}`,
        },
        links: [
          {
            type: "Vidéo YouTube",
            source: "Prof. Hank Stalica : C-String Functions (strstr & strcmp)",
            url: "https://www.youtube.com/results?search_query=hank+stalica+c+string+functions+strstr+strcmp",
            label: "Visionner le cours Hank Stalica (YouTube)",
          },
          {
            type: "Vidéo YouTube",
            source: "Education4u : String Library Functions in C",
            url: "https://www.youtube.com/results?search_query=education4u+string+library+functions+in+c",
            label: "Voir le cours Education4u (YouTube)",
          },
          {
            type: "Documentation",
            source: "Linux Man Page : strcmp(3) & strncmp(3)",
            url: "https://man7.org/linux/man-pages/man3/strcmp.3.html",
            label: "Man Page Officielle Linux strcmp",
          },
          {
            type: "Documentation",
            source: "Linux Man Page : strstr(3)",
            url: "https://man7.org/linux/man-pages/man3/strstr.3.html",
            label: "Man Page Officielle Linux strstr",
          },
        ],
      },
    ],
    quiz: [
      {
        id: "qcm-1",
        question: "Quel est le comportement de my_strncpy(dest, \"Hello\", 3) ?",
        options: [
          { key: "A", label: "Copie 'Hel' et ajoute automatiquement '\\0' à dest[3]." },
          { key: "B", label: "Copie 'Hel' sans ajouter de '\\0' final." },
          { key: "C", label: "Provoque un Segfault car la taille est inférieure." },
        ],
        correctKey: "B",
        explanation:
          "Quand n <= strlen(src), strncpy ne garantit PAS la présence du caractère nul '\\0'.",
      },
      {
        id: "qcm-2",
        question: "Que renvoie my_strcmp(\"ABC\", \"ABD\") ?",
        options: [
          { key: "A", label: "Une valeur négative (< 0) correspondant à 'C' - 'D'." },
          { key: "B", label: "Une valeur positive (> 0)." },
          { key: "C", label: "0 car la longueur est la même." },
        ],
        correctKey: "A",
        explanation:
          "La première différence se situe à l'indice 2 ('C' ASCII 67 - 'D' ASCII 68 = -1).",
      },
      {
        id: "qcm-3",
        question: "Dans Criterion, quelle macro permet de valider l'égalité de deux chaînes C ?",
        options: [
          { key: "A", label: "cr_assert(s1 == s2)" },
          { key: "B", label: "cr_assert_str_eq(s1, s2)" },
          { key: "C", label: "cr_expect_eq(s1, s2)" },
        ],
        correctKey: "B",
        explanation:
          "cr_assert_str_eq compare le contenu pointé par les chaînes, alors que == comparerait leurs adresses mémoire.",
      },
    ],
  },
];
