 export const projectData = {
    title: "Bachelors Project",
    subtitle: "Multi-Device Environment Reconstruction for Augmented Reality Collaboration",
    description: "The aim of this project was to scan an environment for augmented reality collaboration and address the challenge of achieving seamless interaction across multiple devices.",
    thumbnail: "/imports/PointcloudImage.png",
    duration: "3 Months",
    technologies: ["Unreal Engine", "C++", "COLMAP", "OpenXR"],
    images: {
      image1: "/imports/cameraPositions.png",
      image2: "/imports/BaseLineResult.png",
      densePointCloud: "/imports/DensePointCloud.png",
      sparsePointCloud: "/imports/SparsePointCloud.png",

    },
    sections: {
      overview: "The project aimed to enable multiple AR devices to scan and reconstruct a shared environment, facilitating collaborative interactions in augmented reality. The system was designed to capture data from the devices, process it to create a unified 3D point cloud of the environment and enable real-time interaction between users within the reconstructed space.",
      objectives: "Enable multiple AR devices to scan and reconstruct a shared environment, facilitating collaborative interactions in augmented reality.",
      challenges: "One of the biggest challenges was ensuring real-time performance given the limited capabilities of mobile devices. Additionally, achieving accurate environment reconstruction while maintaining low latency for collaborative interactions presented a significant challenge. This was achieved using a server-client architecture, whereby the task of environment reconstruction was offloaded to a powerful server while the AR devices focused on rendering and user interactions.",
      results: "While the reconstruction produced highly detailed environment models, the HoloLens struggled to render them in real time, resulting in a suboptimal user experience. Future work should focus on optimising the rendering pipeline and exploring the use of more powerful AR devices, in order to realise the full potential of multi-device environment reconstruction for augmented reality collaboration."
    }
  };