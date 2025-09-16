import { createI18n } from "vue-i18n";
import BlogMain from "./views/BlogMain.vue";

const messages = {
  en: {
    cookies: {
      message: "We use cookies to improve your experience. Accept them?",
      accept: "Accept",
      decline: "Decline",
      preferences: "Preferences",
      preferences_title: "Cookie Preferences",
      analytics: "Allow analytics cookies",
      marketing: "Allow marketing cookies",
      save: "Save Preferences",
      close: "Close"
    },
    navigation: {
      home: "Home",
      start: "Start",
      explore: "Explore",
      calendar: "Calendar",
      blogmain: "Blog",
      leaderboard: "Leaderboard",
      newsletter: "Newsletter"
    },
    auth: {
      profile: "Profile",
      signOut: "Sign out"
    },
    hero: {
      title: "Not Just a Meetup",
      subtitle: "Connect, learn, and have fun with Bitcoin Beer.",
      explore: "Explore",
      getStarted: "Get Started",
    },

    events: {
      upcomingEvents: "Upcoming Events",
      previous: "Previous",
      next: "Next",
      venue: "Venue",
      address: "Address",
      buyTickets: "Buy Tickets",
      shareEvent: "Share Event",
      posterAlt: "Event poster",
      share: "Share",
      seeAllEvents: "See all events",
      buy: "Buy Ticket"
    },

    eventspage: {
      title: "Events we host at Beer...",
      description: "Browse the calendar and join our events",
      unknown: "Date to be announced",
      time: "Time",
      place: "Place",
      more: "More",
      buy: "Buy"
    },
    

    bitcoin: {
      title: "Bitcoin Beer: Join the Revolution",
      description:
        "Bitcoin Beer events are unique gatherings where technology, networking, and passion converge. Talk ONLY about Bitcoin, exchange ideas, and create meaningful connections. Take your knowledge to new heights while being part of a dynamic and passionate community.",
      findChapter: "Discover",
      organizeMeet: "Organize & Connect",
      organizeMeetDesc:
        "Join exclusive events and meet enthusiasts and professionals. Every meetup is an opportunity to grow, share experiences, and discover new paths. From casual networking to thought-provoking debates, every event is a moment to remember.",
      educateLearn: "Educate & Learn",
      educateLearnDesc:
        "Dive into key topics with experts, explore real-world applications, and take your Bitcoin knowledge to the next level. Learn how to apply this knowledge and become a pillar in your community.",
      anonymitySet: "Anonymity Set",
      anonymitySetDesc:
        "Experience a secure and protected environment to discuss Bitcoin while preserving your privacy and anonymity. Discover advanced technologies to safeguard your transactions and personal data.",
      orangePill: "OrangePill",
      orangePillDesc:
        "Spread Bitcoin knowledge in your community. Support local merchants in adopting Bitcoin, create strong networks, and foster the growth of an ecosystem based on economic freedom.",
    },
    dashboard: {
      title: "Manage Your Bitcoin Beer Community",
      subtitle: "With our new dashboard, you can easily manage and update your local community.",
      feature1: "View real-time statistics about your community.",
      feature2: "Create events and sell tickets seamlessly.",
      feature3: "Easily update your community details.",
      feature4: "Plan and coordinate future developments.",
      cta: "More",
      card1Title: "Statistics",
      card1Description: "Monitor key metrics about your community.",
      card2Title: "Event Creation",
      card2Description: "Organize events easily for your community.",
      card3Title: "Ticket Management",
      card3Description: "Manage and sell tickets seamlessly.",
      card4Title: "Community Updates",
      card4Description: "Stay connected and keep members informed."
    },
    donation: {
      supportProject: "Support Our Project",
      choosePlan: "Choose a donation plan to help us grow and make a difference!",
      earlySupporter: "Early Supporter",
      earlySupporterDesc: "Contribute with a symbolic donation and support the beginning of our journey.",
      adopter: "Adopter",
      adopterDesc: "Take a step forward and believe in our values and mission.",
      superhero: "Superhero",
      superheroDesc: "Support the project significantly and become our hero.",
      donateNow: "Donate Now"
    },
    stats: {
      title: "Bitcoin Beer Statistics",
      description: "Explore the data showcasing the growth and impact of our project.",
      groups: "Groups",
      groupsDesc: "Total number of active Chaptersgroups in our community.",
      totalMembers: "Total Members",
      totalMembersDesc: "The number of members actively participating.",
      totalMessages: "Total Messages",
      totalMessagesDesc: "Messages shared by members in the groups."
    },
    edumain: {
      title: "Discover Bitcoin Beer Edu",
      description:
        "Join our educational events to learn more about Bitcoin through workshops, discussions and community-led initiatives.",
      learnMore: "More",
    },
    pubmain: {
      title: "Discover Bitcoin Beer Pub",
      description:
        "Connect with enthusiasts in a friendly environment, sharing experiences and networking at Bitcoin-themed events.",
      explore: "More",
    },
    edu: {
      title: "Discover Bitcoin Beer Edu",
      description:
        "Join our educational events to learn more about Bitcoin through workshops, discussions, and community-led initiatives.",
      learnMore: "Learn More",
    },
    pub: {
      title: "Explore Bitcoin Beer Pubs",
      description:
        "Connect with enthusiasts in a friendly environment, sharing experiences and networking over Bitcoin-themed events.",
      explore: "Explore Now",
    },
    bitcoinBeer: {
      title: "Start Your Bitcoin Beer",
      subtitle: "Check the map to see if a Beer is already in your area or start your own community.",
      card1Title: "Starting a Beer is Easy",
      card1Desc: "Join the coordination group and request access to the Dashboard.",
      card1Button: "Start Now",
      card2Title: "Check the Map",
      card2Desc: "Before starting a new community, check the map.",
      card2Button: "Explore"
    },
    chapters: {
      title: "Bitcoin Beer Chapters",
      subtitle: "Learn how to start a Bitcoin Beer chapter in your city or join an existing community.",
      coordinationGroup: "Go to the coordination group",
      step1Title: "Check the map",
      step1Description: "Before creating a new chapter, check if a group already exists in your city on the map.",
      mapLink: "Go to the map",
      step2Title: "Request coordination approval",
      step2Description: "Join the coordination group on Telegram and request the opening of a new chapter.",
      step3Title: "Create a public group",
      step3Description: "Create a public Telegram group for your city, e.g., BitcoinBeerFirenze.",
      step4Title: "Access the dashboard",
      step4Description: "Gain access to the dashboard to manage events and your chapter's community.",
    },
    footer: {
      brandName: "Bitcoin Beer",
      product: {
        title: "Product",
        features: "About",
        pricing: "Partners",
        faq: "FAQ",
      },
      company: {
        title: "Terms",
        privacy: "Privacy",
        terms: "Terms of Service",
      },
      developers: {
        title: "Developers",
        api: "Media Kit",
        documentation: "API",
        guides: "Status",
      },
      socialMedia: {
        title: "Social Media",
        facebook: "Facebook",
        instagram: "Instagram",
        twitter: "X",
        telegram: "Telegram",
        mastodon: "Mastodon",
      },
      copyright: "© 2024 Bitcoin Beer. All rights reserved.",
    },
    subscribe: {
      heroTitle: "Subscribe to our newsletter",
      heroDescription: "Get updates and news straight to your inbox.",
      labelEmail: "Email",
      placeholderEmail: "Enter your email",
      labelName: "Name",
      placeholderName: "Enter your name (optional)",
      button: "Subscribe",
      invalidEmail: "Please enter a valid email.",
      success: "Thank you for subscribing!",
      serverError: "An error occurred. Please try again later.",
      networkError: "Network error. Please check your connection.",
    },
    welcome: {
      welcome_message: "Welcome to the Bitcoin Beer",
      welcome_submessage: "Discover events and opportunities near you.",
    },
    edu: {
      title: 'A World of Bitcoin Education',
      description: 'Join our EDU meetups to explore the world of Bitcoin with experts and enthusiasts.',
      learnMore: 'Learn More',
      section1Title: 'Why Attend Our EDU Meetups?',
      section1Description: 'EDU meetups provide a friendly space to discover, learn, and discuss Bitcoin with experts and enthusiasts.',
      section2Title: 'Our Goals',
      section2Description: 'Building an aware, informed, and engaged community within the Bitcoin ecosystem.',
      galleryTitle: 'Moments from Our Meetups',
    },

    pub: {
      title: 'Informal Bitcoin Meetups',
      description: 'Connect with Bitcoin enthusiasts in a relaxed and informal setting.',
      explore: 'Learn more',
      infoTitle: 'What are Bitcoin Beer Meetups?',
      infoDescription: 'Our meetups are an opportunity to meet other Bitcoin enthusiasts, share ideas, and discuss projects, all while enjoying a beer.',
      galleryTitle: 'Moments from Our Meetups',
    },
    contact: {
      title: "Let's talk!",
      subtitle: "Write to us for any information or requests.",
      name: "Full Name",
      email: "Email",
      message: "Message",
      placeholderName: "Enter your name",
      placeholderEmail: "Enter your email",
      placeholderMessage: "Enter your message",
      button: "Send Message",
      success: "Thank you for contacting us!",
      error: "Please fill out all fields!",
      errorSend: "Error sending the email. Try again later.",
    },
    dashboardpage: {
      heroTitle: "Manage Your Community with Ease",
      heroSubtitle: "Our dashboard helps you organize events, manage tickets, and grow your local community.",
      tryNowButton: "Try the Dashboard",
      featuresTitle: "Key Features",
      feature1Title: "Real-Time Analytics",
      feature1Desc: "Track your community's activity with detailed insights.",
      feature2Title: "Event Management",
      feature2Desc: "Create, manage, and sell tickets for your events.",
      feature3Title: "Community Updates",
      feature3Desc: "Keep your community updated with the latest news.",
      feature4Title: "Growth Planning",
      feature4Desc: "Plan and coordinate future developments effortlessly.",
    },
    brandPage: {
      title: "Design language",
      heroSubtitle: "Explore our branding resources including logos, typography, and color palette.",
      logosTitle: "Logos",
      logosDescription: "Download the appropriate version of the logo for your intended use.",
      typographyTitle: "Typography",
      typographyDescription: "Install fonts that create and define the visual style of the brand.",
      colorsTitle: "Colors",
      colorsDescription: "Use brand colors for digital screens and print applications.",
    },
    colors: {
      heroTitle: "Your Brand Color Guide",
      heroSubtitle: "Discover and use the official brand colors.",
      mainColorsTitle: "Main Colors",
      mainColorsSubtitle: "These colors represent the core visual identity of our brand.",
      eduColorsTitle: "Specific Colors for Bitcoin Beer Edu",
      eduColorsSubtitle: "Used for educational and thematic materials.",
      pubColorsTitle: "Specific Colors for Bitcoin Beer Pub",
      pubColorsSubtitle: "Perfect for a social and convivial theme.",
    },
    typography: {
      mainTitle: "The Primary Font of Our Brand",
      description: "We use our primary font mainly for the web and in marketing communications (print, digital presentations).",
      fontDetailsTitle: "Font Details",
      useWeb: "Optimized for web usage.",
      usePrint: "Perfect for printed materials.",
      usePresentation: "Ideal for digital presentations.",
      downloadFont: "Download Font",
      specificationsTitle: "Font Specifications",
      weight: "Weight",
      weightDesc: "Available in Regular, Medium, and Bold.",
      style: "Style",
      styleDesc: "Modern, fresh, and clean.",
      size: "Size",
      sizeDesc: "Optimized for readability in various sizes.",
    },
    logos: {
      heroTitle: "Logos",
      mainLogosTitle: "Main Logo and Symbol",
      eduLogosTitle: "Bitcoin Beer EDU Logos",
      pubLogosTitle: "Bitcoin Beer PUB Logos",
      download: "Download",
    },
    partners: {
      title: 'Our Partners',
      subtitle: 'We collaborate with industry leaders to foster innovation and community.',
    },
    about: {
      heroTitle: "About Us",
      heroSubtitle: "Bitcoin Beer: Volunteers for Bitcoin in Italy",
      missionTitle: "Our Mission",
      missionDescription:
        "Bitcoin Beer is a volunteer organization dedicated to spreading knowledge about Bitcoin. We strive to create local communities united by a passion for Bitcoin and to promote educational and social events across Italy.",
      communityTitle: "A Growing Community",
      communityDescription:
        "Our strength lies in the community. Bitcoin Beer focuses on creating spaces where people can share ideas, learn, and grow together.",
      communityPoint1: "Local events to spread Bitcoin knowledge.",
      communityPoint2: "Building social networks among Bitcoin enthusiasts.",
      communityPoint3: "Promoting conscious and informed use of Bitcoin.",
      ctaTitle: "Join Us",
      ctaDescription:
        "Want to make a difference in your city? Contact us to learn how you can contribute to the growth of the Bitcoin Beer community.",
      ctaButton: "Contact Us",
    },
    faq: {
      heroTitle: "Frequently Asked Questions",
      heroSubtitle: "We answer the most common questions about our mission and community.",
      title: "Frequently Asked Questions",
      q1: "What is Bitcoin Beer?",
      a1: "Bitcoin Beer is an initiative to create local communities that share a passion for Bitcoin.",
      q2: "How can I join an event?",
      a2: "Check our events section or contact us through the online form.",
      q3: "Do I need Bitcoin experience to join?",
      a3: "No! Bitcoin Beer welcomes everyone, from beginners to experts.",
      q4: "Do you organize events across Italy?",
      a4: "Currently, we operate in various Italian cities. Visit the events section for more details.",
    },
    comingSoon: {
      title: "Coming Soon",
      description: "This feature will be available soon. Stay tuned!",
      backToHome: "Back to Home",
    },
    privacy: {
      title: "Privacy Policy",
      last_updated: "Last updated: 4/3/2025",
      who_we_are: {
        title: "Who We Are",
        content: "<p>Bitcoin Beer is a community project dedicated to Bitcoin enthusiasts.</p>\n<p>We organize events, manage a blog, and provide educational content.</p>\n<p>Our website uses self-hosted technologies to ensure better privacy control.</p>"
      },
      data_collected: {
        title: "Data Collected",
        content: "<p>We do not collect sensitive personal data. However, we use tools to improve user experience, including:</p>\n<ul>\n<li>Umami Analytics (self-hosted) for anonymous site visit statistics.</li>\n<li>Listmonk (self-hosted) for newsletter management.</li>\n<li>Self-hosted dashboard for event and blog management.</li>\n</ul>\n<p>The collected data is anonymous and not shared with third parties.</p>"
      },
      cookies: {
        title: "Cookies and Tracking Technologies",
        content: "<p>Our site uses a cookie management system that allows users to:</p>\n<ul>\n<li>Accept or reject cookies.</li>\n<li>Customize preferences between necessary, analytics, and marketing cookies.</li>\n<li>Block analytics scripts until consent is given.</li>\n</ul>"
      },
      data_storage: {
        title: "Where Data is Stored",
        content: "<p>All data is stored on our self-hosted servers, including:</p>\n<ul>\n<li>Analytics (Umami).</li>\n<li>Newsletter management (Listmonk).</li>\n<li>Event information (dashboard).</li>\n</ul>\n<p>We do not use third-party cloud services for user data management.</p>"
      },
      security: {
        title: "Data Security",
        content: "<p>We adopt measures to protect collected data, including:</p>\n<ul>\n<li>HTTPS encryption.</li>\n<li>Self-hosted servers to minimize privacy risks.</li>\n<li>Access limited to authorized administrators.</li>\n</ul>"
      },
      user_rights: {
        title: "User Rights",
        content: "<p>You have the right to:</p>\n<ul>\n<li>Access the data collected about you.</li>\n<li>Correct inaccurate information.</li>\n<li>Request the deletion of your data (e.g., by unsubscribing from the newsletter).</li>\n<li>Modify cookie preferences at any time.</li>\n</ul>"
      },
      changes: {
        title: "Changes to this Privacy Policy",
        content: "<p>We may update this policy to reflect changes in our services.</p>\n<p>We encourage you to check this page periodically.</p>"
      },
      contact: {
        title: "Contact Us",
        content: "<p>For any questions about our privacy policy, contact us through the site's Contact section.</p>"
      }
    },
      fyndra: {
        try: "Try", 
        subtitle: "Our advanced search",
        placeholder: "Search for an alternative",
        // Messaggio informativo su Bitcoin Beer
        bbmessage: "Bitcoin Beer is in favor of the use of applications and services made in Europe. It has developed Bitcoin Beer Europe to support these services and simplify your search. <a href='https://eu.bitcoinbeer.events' class='underline text-blue-300' target='_blank'>Discover the site</a> or use advanced search Fyndra."      },
      search: {
        cancel: "Cancel",
        searching: "Searching...",
        noResults: "No results found.",
      }
    
  },

  it: {
    cookies: {
      message: "Utilizziamo i cookie per migliorare la tua esperienza. Accetti?",
      accept: "Accetta",
      decline: "Rifiuta",
      preferences: "Preferenze",
      preferences_title: "Preferenze Cookie",
      analytics: "Consenti cookie analitici",
      marketing: "Consenti cookie di marketing",
      save: "Salva Preferenze",
      close: "Chiudi"
    },
    navigation: {
      home: "Home",
      start: "Inizia",
      explore: "Esplora",
      calendar: "Calendario",
      blogmain: "Blog",
      leaderboard: "Classifica",
      newsletter: "Newsletter"
    },
    auth: {
      profile: "Profilo",
      signOut: "Esci"
    },
    
    hero: {
      title: "Non un semplice meetup",
      subtitle: "Connettiti, impara e divertiti con Bitcoin Beer.",
      explore: "Esplora",
      getStarted: "Inizia",
    },
    events: {
      upcomingEvents: "Prossimi Eventi",
      previous: "Precedente",
      next: "Successivo",
      venue: "Luogo",
      address: "Indirizzo",
      buyTickets: "Acquista Ticket",
      shareEvent: "Condividi Evento",
      posterAlt: "Locandina dell'evento",
      share: "Condividi",
      seeAllEvents: "Vedi tutti gli eventi",
      buy: "Acquista Ticket"
    },
    eventspage: {
      title: "Eventi che facciamo al Beer...",
      description: "Scorri il calendario e partecipa ai nostri eventi",
      unknown: "Data da definire",
      time: "Ora",
      place: "Luogo",
      more: "Dettagli",
      buy: "Acquista"
    },
    bitcoin: {
      title: "Bitcoin Beer: Unisciti alla Rivoluzione",
      description:
        "I Bitcoin Beer sono eventi unici dove tecnologia, networking e passione si incontrano. Parla SOLO di Bitcoin, scambia idee e crea connessioni significative. Porta la tua conoscenza a nuovi livelli mentre fai parte di una community dinamica e appassionata.",
      findChapter: "Scopri",
      organizeMeet: "Organizza & Incontra",
      organizeMeetDesc:
        "Unisciti a eventi esclusivi e incontra appassionati e professionisti del settore. Ogni incontro è un'opportunità per crescere, condividere esperienze e scoprire nuove strade. Dai networking informali a dibattiti stimolanti, ogni evento è un momento da ricordare.",
      educateLearn: "Educa & Impara",
      educateLearnDesc:
        "Approfondisci temi fondamentali con esperti, esplora casi pratici e porta la tua conoscenza di Bitcoin a un livello successivo. Scopri come applicare il sapere alla vita reale e diventa un riferimento nella tua comunità.",
      anonymitySet: "Anonymity Set",
      anonymitySetDesc:
        "Sperimenta un ambiente sicuro e protetto per discutere di Bitcoin, preservando sempre la tua privacy e anonimato. Scopri tecnologie avanzate per garantire la sicurezza delle tue transazioni e dei tuoi dati personali.",
      orangePill: "OrangePill",
      orangePillDesc:
        "Diffondi la conoscenza di Bitcoin nella tua comunità. Supporta commercianti locali nell'adozione del Bitcoin, crea reti forti e favorisci la crescita di un ecosistema basato sulla libertà economica.",
    },
    dashboard: {
      title: "Gestisci la tua Community Bitcoin Beer",
      subtitle: "Attraverso la nostra nuova dashboard puoi facilmente gestire e aggiornare la tua community locale.",
      feature1: "Visualizza statistiche in tempo reale sulla tua community.",
      feature2: "Crea eventi e vendi biglietti senza difficoltà.",
      feature3: "Aggiorna facilmente i dettagli della tua community.",
      feature4: "Pianifica e coordina futuri sviluppi.",
      cta: "Scopri",
      card1Title: "StatistAPI Pubblicaiche",
      card1Description: "Monitora metriche chiave sulla tua community.",
      card2Title: "Creazione Eventi",
      card2Description: "Organizza eventi facilmente per la tua community.",
      card3Title: "Gestione Biglietti",
      card3Description: "Gestisci e vendi biglietti senza problemi.",
      card4Title: "Aggiornamenti Community",
      card4Description: "Tieni i membri aggiornati e informati."
    },
    donation: {
      supportProject: "Sostieni il nostro progetto",
      choosePlan: "Scegli un piano di donazione per aiutarci a crescere e fare la differenza!",
      earlySupporter: "Early Supporter",
      earlySupporterDesc: "Contribuisci con una donazione simbolica e sostieni l'inizio del nostro viaggio.",
      adopter: "Adopter",
      adopterDesc: "Un passo avanti per chi crede nei nostri valori e nella nostra missione.",
      superhero: "Superhero",
      superheroDesc: "Supporta il progetto in modo significativo e diventa il nostro eroe.",
      donateNow: "Dona ora"
    },
    stats: {
      title: "Statistiche dei Bitcoin Beer",
      description: "Scopri i dati che mostrano la crescita e l'impatto del nostro progetto.",
      groups: "Gruppi",
      groupsDesc: "Numero totale di gruppi attivi nella nostra community.",
      totalMembers: "Membri Totali",
      totalMembersDesc: "Il numero di membri che partecipano attivamente.",
      totalMessages: "Messaggi Totali",
      totalMessagesDesc: "Messaggi condivisi dai membri nei gruppi."
    },
    edumain: {
      title: "Scopri Bitcoin Beer Edu",
      description:
        "Partecipa ai nostri eventi educativi per approfondire Bitcoin attraverso workshop, discussioni e iniziative guidate dalla community.",
      learnMore: "Scopri di più",
    },
    pubmain: {
      title: "Esplora i Bitcoin Beer Pub",
      description:
        "Connettiti con appassionati in un ambiente accogliente, condividendo esperienze e facendo networking durante eventi a tema Bitcoin.",
      explore: "Esplora ora",
    },

    bitcoinBeer: {
      title: "Apri il tuo Bitcoin Beer",
      subtitle: "Controlla la mappa se è già presente un Beer nella tua zona oppure avvia tu la tua community.",
      card1Title: "Aprire un Beer è semplice",
      card1Desc: "Accedi al gruppo di coordinamento e richiedi l'accesso alla Dashboard.",
      card1Button: "Inizia Ora",
      card2Title: "Controlla la mappa",
      card2Desc: "Prima di avviare una nuova community controlla la mappa.",
      card2Button: "Esplora"
    },
    chapters: {
      title: "Bitcoin Beer Chapters",
      subtitle: "Scopri come avviare un capitolo Bitcoin Beer nella tua città o unirti a una community già esistente.",
      coordinationGroup: "Vai al gruppo coordinamento",
      step1Title: "Controlla la mappa",
      step1Description: "Prima di creare un nuovo capitolo, verifica se esiste già un gruppo nella tua città sulla mappa.",
      mapLink: "Vai alla mappa",
      step2Title: "Fai richiesta al coordinamento",
      step2Description: "Unisciti al gruppo di coordinamento su Telegram e richiedi l'apertura di un nuovo capitolo.",
      step3Title: "Apri un gruppo pubblico",
      step3Description: "Crea un gruppo Telegram pubblico per la tua città, ad esempio BitcoinBeerFirenze.",
      step4Title: "Accedi alla dashboard",
      step4Description: "Ottieni l'accesso alla dashboard per gestire eventi e community del tuo capitolo.",
    },
    footer: {
      brandName: "Bitcoin Beer",
      product: {
        title: "Prodotto",
        features: "Chi siamo",
        pricing: "Partners",
        faq: "FAQ",
      },
      company: {
        title: "Termini",
        privacy: "Privacy",
        terms: "Termini di Servizio",
      },
      developers: {
        title: "Sviluppatori",
        api: "Media Kit",
        documentation: "API",
        guides: "Status",
      },
      socialMedia: {
        title: "Social Media",
        facebook: "Facebook",
        instagram: "Instagram",
        twitter: "X",
        telegram: "Telegram",
        mastodon: "Mastodon",
      },
      copyright: "© 2024 Bitcoin Beer. Tutti i diritti riservati.",
    },
    subscribe: {
      heroTitle: "Iscriviti alla nostra newsletter",
      heroDescription: "Ricevi aggiornamenti e novità direttamente nella tua casella email.",
      labelEmail: "Email",
      placeholderEmail: "Inserisci la tua email",
      labelName: "Nome",
      placeholderName: "Inserisci il tuo nome (opzionale)",
      button: "Iscriviti",
      invalidEmail: "Per favore inserisci un'email valida.",
      success: "Grazie per esserti iscritto!",
      serverError: "Si è verificato un errore. Riprova più tardi.",
      networkError: "Errore di rete. Controlla la tua connessione.",
    },
    welcome: {
      welcome_message: "Benvenuto nel Bitcoin Beer",
      welcome_submessage: "Scopri gli eventi e le opportunità vicino a te.",
    },
    edu: {
      title: 'Un mondo di educazione Bitcoin',
      description: 'Partecipa a meetup EDU per esplorare il mondo di Bitcoin con esperti e appassionati.',
      learnMore: 'Scopri di più',
      section1Title: 'Perché partecipare ai nostri Meetup EDU?',
      section1Description: 'I meetup EDU offrono un ambiente amichevole per scoprire, imparare e discutere Bitcoin con esperti e appassionati.',
      section2Title: 'I nostri obiettivi',
      section2Description: 'Costruire una comunità consapevole, informata e coinvolta nell’ecosistema Bitcoin.',
      galleryTitle: 'Momenti dai Nostri Meetup',
    },

    pub: {
      title: 'Incontri Informali Bitcoin',
      description: 'Connettiti con appassionati di Bitcoin in un ambiente rilassato e informale.',
      explore: 'Scopri di più',
      infoTitle: 'Cosa sono i Bitcoin Beer Meetup?',
      infoDescription: 'I nostri incontri sono un’occasione per conoscere altri appassionati di Bitcoin, condividere idee e discutere progetti, tutto accompagnato da una birra in mano.',
      galleryTitle: 'Momenti dai Nostri Meetup',
    },
    contact: {
      title: "Parliamone!",
      subtitle: "Scrivici per qualsiasi informazione o richiesta.",
      name: "Nome completo",
      email: "Email",
      message: "Messaggio",
      placeholderName: "Inserisci il tuo nome",
      placeholderEmail: "Inserisci la tua email",
      placeholderMessage: "Inserisci il tuo messaggio",
      button: "Invia messaggio",
      success: "Grazie per averci contattato!",
      error: "Per favore, compila tutti i campi!",
      errorSend: "Errore durante l'invio. Riprova più tardi.",
    },
    dashboardpage: {
      heroTitle: "Gestisci la tua Community con Facilità",
      heroSubtitle: "La nostra dashboard ti aiuta a organizzare eventi, gestire biglietti e far crescere la tua community locale.",
      tryNowButton: "Prova la Dashboard",
      featuresTitle: "Funzionalità Chiave",
      feature1Title: "Analisi in Tempo Reale",
      feature1Desc: "Monitora l'attività della tua community con approfondimenti dettagliati.",
      feature2Title: "Gestione Eventi",
      feature2Desc: "Crea, gestisci e vendi biglietti per i tuoi eventi.",
      feature3Title: "Aggiornamenti Community",
      feature3Desc: "Tieni la tua community aggiornata con le ultime novità.",
      feature4Title: "Pianificazione della Crescita",
      feature4Desc: "Pianifica e coordina gli sviluppi futuri senza sforzo.",
    },
    brandPage: {
      title: "Linguaggio del design",
      heroSubtitle: "Esplora le nostre risorse di branding, inclusi loghi, tipografia e palette colori.",
      logosTitle: "Loghi",
      logosDescription: "Scarica la versione appropriata del logo per il tuo utilizzo.",
      typographyTitle: "Tipografia",
      typographyDescription: "Installa i caratteri che creano e definiscono lo stile visivo del brand.",
      colorsTitle: "Colori",
      colorsDescription: "Utilizza i colori del brand per schermi digitali e applicazioni di stampa.",
    },
    colors: {
      heroTitle: "La tua Guida ai Colori del Brand",
      heroSubtitle: "Scopri e utilizza i colori ufficiali del nostro brand.",
      mainColorsTitle: "Colori Principali",
      mainColorsSubtitle: "Questi colori rappresentano il cuore visivo del nostro brand.",
      eduColorsTitle: "Colori Specifici per Bitcoin Beer Edu",
      eduColorsSubtitle: "Utilizzati per materiali educativi e tematici.",
      pubColorsTitle: "Colori Specifici per Bitcoin Beer Pub",
      pubColorsSubtitle: "Perfetti per un tema sociale e conviviale.",
    },
    typography: {
      mainTitle: "Il Font Principale del Nostro Brand",
      description: "Usiamo il nostro font principale per il web e nelle comunicazioni di marketing (stampa, presentazioni digitali).",
      fontDetailsTitle: "Dettagli del Font",
      useWeb: "Utilizzabile per il Web.",
      usePrint: "Perfetto per materiale stampato.",
      usePresentation: "Ideale per presentazioni digitali.",
      downloadFont: "Scarica il Font",
      specificationsTitle: "Specifiche del Font",
      weight: "Peso",
      weightDesc: "Disponibile in Regular, Medium e Bold.",
      style: "Stile",
      styleDesc: "Moderno, fresco e pulito.",
      size: "Dimensione",
      sizeDesc: "Ottimizzato per leggibilità in diverse dimensioni.",
    },
    logos: {
      heroTitle: "Loghi",
      mainLogosTitle: "Logo Principale e Simbolo",
      eduLogosTitle: "Loghi Bitcoin Beer EDU",
      pubLogosTitle: "Loghi Bitcoin Beer PUB",
      download: "Scarica",
    },
    partners: {
      title: 'I nostri Partner',
      subtitle: 'Collaboriamo con leader del settore per promuovere innovazione e comunità.',
    },
    about: {
      heroTitle: "Chi Siamo",
      heroSubtitle: "Bitcoin Beer: Volontari per il Bitcoin in Italia",
      missionTitle: "La Nostra Missione",
      missionDescription:
        "Bitcoin Beer è un’organizzazione di volontari dedicata alla divulgazione del Bitcoin. Ci impegniamo a creare comunità locali unite dalla passione per il Bitcoin e a promuovere eventi educativi e sociali in tutta Italia.",
      communityTitle: "Una Community in Crescita",
      communityDescription:
        "La nostra forza è la community. Bitcoin Beer si concentra sulla creazione di spazi dove le persone possano condividere idee, imparare e crescere insieme.",
      communityPoint1: "Eventi locali per diffondere la conoscenza del Bitcoin.",
      communityPoint2: "Creazione di reti sociali tra appassionati di Bitcoin.",
      communityPoint3: "Promozione di un uso consapevole e informato del Bitcoin.",
      ctaTitle: "Unisciti a Noi",
      ctaDescription: "Vuoi fare la differenza nella tua città? Contattaci per scoprire come puoi contribuire alla crescita della community Bitcoin Beer.",
      ctaButton: "Contattaci",
    },
    faq: {
      heroTitle: "Domande Frequenti",
      heroSubtitle: "Rispondiamo alle domande più comuni sulla nostra missione e comunità.",
      title: "Domande Frequenti",
      q1: "Cos'è Bitcoin Beer?",
      a1: "Bitcoin Beer è un'iniziativa per creare community locali che condividano passione per Bitcoin.",
      q2: "Come posso partecipare a un evento?",
      a2: "Consulta la nostra sezione eventi o contattaci tramite il modulo online.",
      q3: "Devo avere esperienza con Bitcoin per partecipare?",
      a3: "No! Bitcoin Beer è aperto a tutti, dai principianti agli esperti.",
      q4: "Organizzate eventi in tutta Italia?",
      a4: "Attualmente operiamo in diverse città italiane. Visita la sezione eventi per maggiori dettagli.",
    },
    comingSoon: {
      title: "In Arrivo",
      description: "Questa funzionalità sarà presto disponibile. Resta sintonizzato!",
      backToHome: "Torna alla Home",
    },
    privacy: {
      title: "Informativa sulla Privacy",
      last_updated: "Ultimo aggiornamento: 4/3/2025",
      who_we_are: {
        title: "Chi siamo",
        content: "<p>Bitcoin Beer è un progetto dedicato agli appassionati di Bitcoin.</p>\n<p>Organizziamo eventi, gestiamo un blog e forniamo contenuti educativi.</p>\n<p>Il nostro sito utilizza tecnologie self-hosted per garantire un maggiore controllo sulla privacy.</p>"
      },
      data_collected: {
        title: "Dati Raccolti",
        content: "<p>Non raccogliamo dati personali sensibili, tuttavia utilizziamo strumenti per migliorare l’esperienza dell’utente, tra cui:</p>\n<ul>\n<li>Umami Analytics (self-hosted) per statistiche anonime sulle visite al sito.</li>\n<li>Listmonk (self-hosted) per la gestione della newsletter.</li>\n<li>Dashboard self-hosted per la gestione degli eventi e del blog.</li>\n</ul>\n<p>I dati raccolti sono anonimi e non vengono condivisi con terze parti.</p>"
      },
      cookies: {
        title: "Cookies e Tecnologie di Tracciamento",
        content: "<p>Il nostro sito utilizza un sistema di gestione dei cookie che consente di:</p>\n<ul>\n<li>Accettare o rifiutare i cookie.</li>\n<li>Personalizzare le preferenze scegliendo tra cookie necessari, analitici e di marketing.</li>\n<li>Bloccare gli script di analisi fino al consenso.</li>\n</ul>"
      },
      data_storage: {
        title: "Dove vengono conservati i dati",
        content: "<p>Tutti i dati vengono archiviati sui nostri server self-hosted, inclusi:</p>\n<ul>\n<li>Analytics (Umami).</li>\n<li>Gestione newsletter (Listmonk).</li>\n<li>Informazioni sugli eventi (dashboard).</li>\n</ul>\n<p>Non utilizziamo servizi cloud di terze parti per la gestione dei dati degli utenti.</p>"
      },
      security: {
        title: "Sicurezza dei Dati",
        content: "<p>Adottiamo misure per proteggere i dati raccolti, tra cui:</p>\n<ul>\n<li>Crittografia HTTPS.</li>\n<li>Server self-hosted per minimizzare i rischi legati alla privacy.</li>\n<li>Accesso limitato ai soli amministratori autorizzati.</li>\n</ul>"
      },
      user_rights: {
        title: "Diritti degli Utenti",
        content: "<p>Hai il diritto di:</p>\n<ul>\n<li>Accedere ai dati raccolti su di te.</li>\n<li>Rettificare eventuali informazioni inesatte.</li>\n<li>Chiedere la cancellazione dei tuoi dati (ad esempio, disiscrivendoti dalla newsletter).</li>\n<li>Modificare le preferenze sui cookie in qualsiasi momento.</li>\n</ul>"
      },
      changes: {
        title: "Modifiche alla Privacy Policy",
        content: "<p>Potremmo aggiornare questa informativa per riflettere eventuali cambiamenti nei nostri servizi.</p>\n<p>Ti consigliamo di controllare periodicamente questa pagina per rimanere informato.</p>"
      },
      contact: {
        title: "Contattaci",
        content: "<p>Per qualsiasi domanda sulla nostra privacy policy, puoi contattarci tramite la sezione Contatti del sito.</p>"
      }
    },
    fyndra: {
    try: "Prova",
    subtitle: "La nostra ricerca avanzata",
    placeholder: "Cerca un’alternativa",
    bbmessage: "Bitcoin Beer è favorevole all'utilizzo di applicazioni e servizi realizzati in Europa. Ha sviluppato Bitcoin Beer Europe per supportare questi servizi e semplificare la ricerca. <a href='https://eu.bitcoinbeer.events' class='underline text-blue-300' target='_blank'>Scopri il sito</a> o utilizza Fyndra, la nostra ricerca avanzata."
  },
  search: {
    cancel: "Cancel",
    searching: "Searching...",
    noResults: "No results found."
  }
  }
};

const i18n = createI18n({
  locale: "it", // Lingua di default
  fallbackLocale: "en", // Lingua di fallback
  messages,
});

export default i18n;
