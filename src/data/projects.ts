
// Generate random UUIDs for our mock data
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, 
        v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Define Project type
export type Project = {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  image: string;
  members: number;
  isPremium: boolean;
  price?: number;
  topics: string[];
  messages: number;
  resources: number;
  createdAt: string;
};

export const projectsData: Project[] = [
  {
    id: generateUUID(),
    title: "Web Development Mastery",
    description: "Join our community of web developers to learn and share knowledge about the latest technologies and best practices in web development.",
    longDescription: "Our Web Development Mastery community brings together developers of all experience levels to collaborate, learn, and grow. Whether you're just starting out or you're a seasoned professional, you'll find valuable resources, discussions, and networking opportunities here. We cover everything from front-end frameworks like React, Vue, and Angular to back-end technologies like Node.js, Python, and Ruby on Rails. Join us to stay up-to-date with the latest trends, share your knowledge, and advance your career in web development.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80",
    members: 1250,
    isPremium: false,
    topics: ["JavaScript", "HTML", "CSS", "React", "Node.js", "Frontend", "Backend"],
    messages: 4587,
    resources: 215,
    createdAt: "2023-01-15T00:00:00Z"
  },
  {
    id: generateUUID(),
    title: "AI Research Group",
    description: "Explore the cutting-edge of artificial intelligence research, machine learning techniques, and neural networks with our expert community.",
    longDescription: "The AI Research Group is dedicated to exploring the frontiers of artificial intelligence. Our members include researchers, data scientists, engineers, and enthusiasts who are passionate about advancing AI technology. We discuss the latest papers, share insights on novel approaches, and collaborate on projects that push the boundaries of what's possible with AI. Topics include deep learning, natural language processing, computer vision, reinforcement learning, and ethical considerations in AI development.",
    image: "https://images.unsplash.com/photo-1677442135132-143ff1aef331?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    members: 867,
    isPremium: true,
    price: 29,
    topics: ["Machine Learning", "Neural Networks", "Deep Learning", "NLP", "Computer Vision", "Ethics in AI"],
    messages: 3125,
    resources: 182,
    createdAt: "2023-03-22T00:00:00Z"
  },
  {
    id: generateUUID(),
    title: "Design Thinking Pro",
    description: "Connect with fellow designers, share your portfolio, get feedback, and stay updated with the latest design trends and tools.",
    longDescription: "Design Thinking Pro is a premium community for designers who want to take their craft to the next level. Our members include UI/UX designers, product designers, graphic designers, and creative directors from leading companies around the world. We focus on the design thinking methodology, user-centered design principles, and the intersection of design and business. Through portfolio reviews, design challenges, and expert discussions, members continuously improve their skills and expand their professional networks.",
    image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    members: 1872,
    isPremium: true,
    price: 19,
    topics: ["UI/UX", "Product Design", "Figma", "Adobe XD", "Design Systems", "User Research"],
    messages: 5891,
    resources: 347,
    createdAt: "2022-11-05T00:00:00Z"
  },
  {
    id: generateUUID(),
    title: "Mobile App Developers",
    description: "Share your mobile app development experience, discuss frameworks like React Native and Flutter, and solve common challenges.",
    longDescription: "Our Mobile App Developers community brings together iOS, Android, and cross-platform developers to share knowledge, solve problems, and stay on top of the rapidly evolving mobile landscape. Whether you're working with Swift, Kotlin, React Native, Flutter, or other frameworks, you'll find discussions and resources relevant to your work. Members help each other troubleshoot issues, optimize app performance, implement cutting-edge features, and navigate the app store submission process.",
    image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    members: 945,
    isPremium: false,
    topics: ["iOS", "Android", "React Native", "Flutter", "Swift", "Kotlin", "App Store Optimization"],
    messages: 2735,
    resources: 164,
    createdAt: "2023-02-18T00:00:00Z"
  },
  {
    id: generateUUID(),
    title: "Data Science Hub",
    description: "Discuss data analysis techniques, statistics, visualization tools, and how to extract meaningful insights from large datasets.",
    longDescription: "The Data Science Hub is where data professionals come together to explore the intricacies of working with data. Our community includes data scientists, analysts, engineers, and business intelligence professionals who share their expertise on topics ranging from statistical analysis and data visualization to predictive modeling and data ethics. We discuss tools like Python, R, SQL, Tableau, and Power BI, as well as methodologies for effectively extracting insights from data and communicating those insights to stakeholders.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    members: 1134,
    isPremium: true,
    price: 24,
    topics: ["Python", "R", "SQL", "Data Visualization", "Machine Learning", "Statistics", "Big Data"],
    messages: 3842,
    resources: 278,
    createdAt: "2023-01-30T00:00:00Z"
  },
  {
    id: generateUUID(),
    title: "Cybersecurity Experts",
    description: "Discuss the latest threats, security tools, ethical hacking techniques, and best practices to protect digital assets.",
    longDescription: "Our Cybersecurity Experts community is dedicated to promoting security awareness, sharing information about emerging threats, and discussing effective defensive strategies. Members include security analysts, penetration testers, network administrators, and security-conscious developers who collaborate to stay ahead of cyber threats. Topics covered include network security, application security, cryptography, security policy, incident response, and ethical hacking. We emphasize hands-on learning through CTF challenges and real-world case studies.",
    image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    members: 731,
    isPremium: false,
    topics: ["Network Security", "Penetration Testing", "OWASP", "Cryptography", "Threat Intelligence", "Incident Response"],
    messages: 1985,
    resources: 142,
    createdAt: "2023-04-12T00:00:00Z"
  },
  {
    id: generateUUID(),
    title: "Cloud Solutions Architects",
    description: "Share knowledge about AWS, Azure, Google Cloud, and best practices for designing scalable and resilient cloud architectures.",
    longDescription: "The Cloud Solutions Architects community brings together professionals who design, implement, and optimize cloud infrastructure across major platforms like AWS, Azure, and Google Cloud. Our members exchange ideas on serverless architecture, containerization, microservices, infrastructure as code, cost optimization, and multi-cloud strategies. Through case studies, architecture reviews, and best practice discussions, we help each other create more scalable, reliable, and cost-effective cloud solutions for organizations of all sizes.",
    image: "https://images.unsplash.com/photo-1522199755839-a2bacb67c546?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80",
    members: 589,
    isPremium: true,
    price: 34,
    topics: ["AWS", "Azure", "Google Cloud", "Kubernetes", "Docker", "Terraform", "Serverless"],
    messages: 1645,
    resources: 198,
    createdAt: "2023-05-08T00:00:00Z"
  },
  {
    id: generateUUID(),
    title: "Game Developers Unite",
    description: "Connect with indie and professional game developers to discuss game design, mechanics, graphics, and monetization strategies.",
    longDescription: "Game Developers Unite is a community for anyone involved in creating games - from indie developers and hobbyists to professionals at AAA studios. Our members share knowledge about game engines like Unity and Unreal, discuss game design principles, exchange tips on graphics and animation, and help each other navigate the challenges of marketing and monetizing games. We also organize game jams where members can collaborate on short-term projects and get feedback on their work.",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
    members: 1420,
    isPremium: false,
    topics: ["Unity", "Unreal Engine", "Game Design", "3D Modeling", "Pixel Art", "Game Audio", "Indie Game Development"],
    messages: 4125,
    resources: 256,
    createdAt: "2023-02-27T00:00:00Z"
  },
  {
    id: generateUUID(),
    title: "DevOps Practitioners",
    description: "Discuss CI/CD pipelines, container orchestration, infrastructure as code, and other DevOps practices and tools.",
    longDescription: "The DevOps Practitioners community is where professionals come together to share experiences and best practices around DevOps culture, tools, and methodologies. Our discussions cover CI/CD pipelines, infrastructure as code, configuration management, monitoring and observability, and site reliability engineering. Members help each other automate processes, improve deployment workflows, reduce mean time to recovery, and foster better collaboration between development and operations teams.",
    image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    members: 672,
    isPremium: true,
    price: 29,
    topics: ["CI/CD", "Docker", "Kubernetes", "Jenkins", "Ansible", "Monitoring", "GitOps"],
    messages: 2370,
    resources: 183,
    createdAt: "2023-03-15T00:00:00Z"
  }
];
