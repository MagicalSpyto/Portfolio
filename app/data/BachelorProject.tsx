 export const projectData = {
    title: "Bachelor Project",
    subtitle: "Multi-Device Environment Reconstruction for Augmented Reality Collaboration",
    description: "This project focuses on scanning an environment for augmented reality collaboration, addressing the challenge of seamless interaction across multiple devices.",
    thumbnail: "/imports/PointcloudImage.png",
    duration: "3 Months",
    technologies: ["Unreal Engine", "C++", "COLMAP", "OpenXR"],
    sections: {
      overview: "The project aimed to enable multiple AR devices to scan and reconstruct a shared environment, allowing for collaborative interactions in augmented reality. The system was designed to capture data from multiple devices, process it to create a unified 3D point cloud of the environment, and facilitate real-time interactions between users within the reconstructed space.",
      objectives: "Enable multiple AR devices to scan and reconstruct a shared environment, allowing for collaborative interactions in augmented reality.",
      challenges: "One of teh biggeste challenges was ensuring real-time performance due to the lacking capabilities of mobile devices. Additionally, achieving accurate environment reconstruction while maintaining low latency for collaborative interactions was a significant hurdle. These where addressed by using a server-client architecture, where the heavy lifting of environment reconstruction was offloaded to a powerful server, while the AR devices focused on rendering and user interactions.",
      results: "The reconstuction showed prommising results, with highly detailed enviroment modles, but the hololens struggled to render the models in real-time, leading to a suboptimal user experience. Future work should focus on optimizing the rendering pipeline and exploringthe use of more powerfull AR devices to fully realize the potential of multi-device environment reconstruction for augmented reality collaboration."
    }
  };