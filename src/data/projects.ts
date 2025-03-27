
// Generate random UUIDs for our mock data
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, 
        v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const projectsData = [
  {
    id: generateUUID(),
    title: "Web Development Mastery",
    description: "Join our community of web developers to learn and share knowledge about the latest technologies and best practices in web development.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80",
    members: 1250,
    isPremium: false
  },
  {
    id: generateUUID(),
    title: "AI Research Group",
    description: "Explore the cutting-edge of artificial intelligence research, machine learning techniques, and neural networks with our expert community.",
    image: "https://images.unsplash.com/photo-1677442135132-143ff1aef331?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    members: 867,
    isPremium: true,
    price: 29
  },
  {
    id: generateUUID(),
    title: "Design Thinking Pro",
    description: "Connect with fellow designers, share your portfolio, get feedback, and stay updated with the latest design trends and tools.",
    image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    members: 1872,
    isPremium: true,
    price: 19
  },
  {
    id: generateUUID(),
    title: "Mobile App Developers",
    description: "Share your mobile app development experience, discuss frameworks like React Native and Flutter, and solve common challenges.",
    image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    members: 945,
    isPremium: false
  },
  {
    id: generateUUID(),
    title: "Data Science Hub",
    description: "Discuss data analysis techniques, statistics, visualization tools, and how to extract meaningful insights from large datasets.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    members: 1134,
    isPremium: true,
    price: 24
  },
  {
    id: generateUUID(),
    title: "Cybersecurity Experts",
    description: "Discuss the latest threats, security tools, ethical hacking techniques, and best practices to protect digital assets.",
    image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    members: 731,
    isPremium: false
  },
  {
    id: generateUUID(),
    title: "Cloud Solutions Architects",
    description: "Share knowledge about AWS, Azure, Google Cloud, and best practices for designing scalable and resilient cloud architectures.",
    image: "https://images.unsplash.com/photo-1522199755839-a2bacb67c546?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80",
    members: 589,
    isPremium: true,
    price: 34
  },
  {
    id: generateUUID(),
    title: "Game Developers Unite",
    description: "Connect with indie and professional game developers to discuss game design, mechanics, graphics, and monetization strategies.",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
    members: 1420,
    isPremium: false
  },
  {
    id: generateUUID(),
    title: "DevOps Practitioners",
    description: "Discuss CI/CD pipelines, container orchestration, infrastructure as code, and other DevOps practices and tools.",
    image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    members: 672,
    isPremium: true,
    price: 29
  }
];
