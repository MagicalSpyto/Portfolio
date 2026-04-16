export const projectData = {
    title: "Asteroid AR Ship",
    subtitle: "An AR experience realized on Apple's iPad utilizing ARKit and the system's LiDAR scanner.",
    description: "This project was based on modern AR art instalations, utilizing the real world and enhincing it in ways that are not possible using conventional means.",
    thumbnail: "/imports/IconARShip.png",
    duration: "3 months",
    technologies: ["Unity", "Apple ARKit", "C#", "Autodesk Maya"],
    images: {
      image1: "/imports/UfoGut.png",
      image2: "/imports/Ufo2Gut.png",
    },
    sections: {
      overview: "This project involded planing arround the unique environment presented by the universetys facilities and learning and implementing the technology nescesarry to ralite the project concept. In out vision we tried to make use of the vast open spaces, provided by the univierities atrium to create a large scale AR experience, that would interact with the real world as one could percieve it.",
      challenges: "Our prototype faces the most pressing chalange, in lettign the objects in out prototype interact wit hthe real world in a belivable way. As the LIDAR scanners of the Ipad only have a limmetd range it was infeasable to create a large scale digital representation in real time. To adress this we decided to create a Digital Twin of the environment, that was acurate enought to be used as a basis for the interactions. This was also done using the LIDAR scanner to create a comprehendsive scan of the environment and substituting the missing geometry with real world measurements. resulting in a belivable interaction with the real world.",
    }
  };
