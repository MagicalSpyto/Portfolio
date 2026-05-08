export const projectData = {
    title: "Asteroid AR Ship",
    subtitle: "An AR experience realised on an Apple iPad using ARKit and the device's LiDAR scanner.",
    description: "This project was based on modern AR art installations that utilise the real world and enhance it in ways that are not possible using conventional means.",
    thumbnail: "/imports/IconARShip.png",
    duration: "3 months",
    technologies: ["Unity", "Apple ARKit", "C#", "Autodesk Maya"],
    images: {
      image1: "/imports/UfoGut.png",
      image2: "/imports/Ufo2Gut.png",
      image3: "/imports/asteroidGut.png",
    },
    sections: {
      overview: "This project involved planning around the unique environment presented by the university's facilities and learning and implementing the necessary technology to realise the project concept. In our vision, we aimed to utilise the extensive open spaces provided by the university's atrium to create a large-scale AR experience that interacts with the real world as it is perceived.",
      challenges: "The most pressing challenge for our prototype is enabling the objects within it to interact with the real world in a believable way. As the iPad's LIDAR scanners have a limited range, creating a large-scale digital representation in real time was infeasible. To address this, we created a digital twin of the environment that was accurate enough to be used as a basis for the interactions. This was achieved by using the LIDAR scanner to create a comprehensive scan of the environment and substituting the missing geometry with real-world measurements, resulting in believable interactions with the real world.",
    }
  };
