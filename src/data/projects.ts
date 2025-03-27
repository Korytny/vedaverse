
// Project/Community data types
export type Project = {
  id: string;
  title: string;
  description: string;
  members: number;
  image: string;
  isPremium: boolean;
  price?: number;
  createdAt: string;
  topics: string[];
  messages: number;
  resources: number;
  longDescription: string;
};

// Shared project data - would be fetched from Supabase in real implementation
// Using let instead of const so we can modify the array
export let projectsData: Project[] = [
  {
    id: "1",
    title: "Web Development Mastery",
    description: "Learn modern web development with expert mentors and a supportive community. Covers React, Node.js, and more.",
    members: 2543,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop",
    isPremium: false,
    createdAt: "2023-06-15",
    topics: ["React", "JavaScript", "Node.js", "HTML/CSS"],
    messages: 15243,
    resources: 124,
    longDescription: "Our Web Development Mastery community is designed for aspiring and established developers who want to improve their skills in modern web technologies. Whether you're just starting out or looking to level up your expertise, our community provides a supportive environment for learning and collaboration.\n\nOur expert mentors have years of industry experience and are committed to helping you succeed. Regular code reviews, pair programming sessions, and personalized feedback are just some of the ways our mentors support your learning journey.\n\nJoin us to access comprehensive learning resources, participate in engaging discussions, and connect with a global network of developers who are passionate about web development.",
  },
  {
    id: "2",
    title: "Design Thinking Pro",
    description: "Elevate your design skills with feedback from industry professionals. Includes UX/UI design principles and case studies.",
    members: 1872,
    image: "https://images.unsplash.com/photo-1613909207039-6b173b755cc1?q=80&w=2072&auto=format&fit=crop",
    isPremium: true,
    price: 29.99,
    createdAt: "2023-08-22",
    topics: ["UI/UX", "Design Principles", "Prototyping", "User Research"],
    messages: 8762,
    resources: 86,
    longDescription: "Design Thinking Pro is the premier community for designers who want to take their skills to the next level. Our community brings together UI/UX designers, product designers, and design enthusiasts from around the world to share ideas, provide feedback, and collaborate on projects.\n\nWith access to industry professionals who provide regular feedback and guidance, you'll be able to refine your design process and create more effective, user-centered designs. Our case studies and design challenges provide real-world practice opportunities, while our resource library contains valuable templates, tools, and research materials.\n\nJoin Design Thinking Pro to elevate your design career and connect with a community of like-minded creatives who are passionate about great design."
  },
  {
    id: "3",
    title: "Data Science Community",
    description: "Master data analysis and machine learning with practical projects and expert guidance.",
    members: 3215,
    image: "https://images.unsplash.com/photo-1543286386-2e659306cd6c?q=80&w=2070&auto=format&fit=crop",
    isPremium: false,
    createdAt: "2023-07-10",
    topics: ["Python", "Machine Learning", "Data Analysis", "Statistics"],
    messages: 12453,
    resources: 98,
    longDescription: "Our Data Science Community is built for those who want to master the art and science of extracting insights from data. Whether you're a beginner or an experienced data scientist, our community offers resources, guidance, and collaborative projects to help you grow your skills.\n\nYou'll learn from industry experts who share practical insights on data cleaning, visualization, machine learning algorithms, and model deployment. Our hands-on approach emphasizes real-world projects that you can add to your portfolio.\n\nJoin us to connect with fellow data enthusiasts, participate in hackathons and challenges, and stay updated on the latest trends and technologies in the data science field."
  },
  {
    id: "4",
    title: "Entrepreneurship Guild",
    description: "Connect with founders and business experts to accelerate your startup journey.",
    members: 1432,
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop",
    isPremium: true,
    price: 49.99,
    createdAt: "2023-09-05",
    topics: ["Startups", "Business Strategy", "Marketing", "Fundraising"],
    messages: 7865,
    resources: 64,
    longDescription: "The Entrepreneurship Guild is your trusted partner on the entrepreneurial journey. Our community connects founders, business experts, and aspiring entrepreneurs who share knowledge, experiences, and opportunities.\n\nYou'll gain access to practical resources on business planning, marketing strategy, customer acquisition, and fundraising. Our mentors provide personalized guidance to help you overcome challenges and capitalize on opportunities in your business.\n\nNetwork with fellow entrepreneurs, participate in pitch sessions, and learn from successful founders who have navigated the startup landscape. Whether you're just starting out or scaling up, our community offers the support and insights you need to succeed."
  },
  {
    id: "5",
    title: "Creative Writing Workshop",
    description: "Develop your writing skills with structured feedback and community support.",
    members: 987,
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=2073&auto=format&fit=crop",
    isPremium: false,
    createdAt: "2023-05-20",
    topics: ["Fiction", "Poetry", "Creative Nonfiction", "Storytelling"],
    messages: 5243,
    resources: 47,
    longDescription: "Our Creative Writing Workshop is a supportive space for writers of all levels to hone their craft. Whether you're working on a novel, short stories, poetry, or creative nonfiction, our community provides the feedback and encouragement you need to grow as a writer.\n\nParticipate in regular writing exercises, themed challenges, and peer critique sessions that help you develop your unique voice and style. Our facilitators offer constructive feedback and practical tips to improve your writing technique.\n\nConnect with fellow writers who understand the joys and struggles of the creative process. Share your work, exchange ideas, and find inspiration in a community that celebrates the written word and supports your growth as an author."
  },
  {
    id: "6",
    title: "AI & Machine Learning Pro",
    description: "Dive deep into artificial intelligence with hands-on projects and expert mentorship.",
    members: 2145,
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2145&auto=format&fit=crop",
    isPremium: true,
    price: 39.99,
    createdAt: "2023-08-15",
    topics: ["Artificial Intelligence", "Deep Learning", "Neural Networks", "Computer Vision"],
    messages: 9876,
    resources: 112,
    longDescription: "AI & Machine Learning Pro is designed for those who want to master cutting-edge AI technologies and applications. Our community brings together AI enthusiasts, researchers, and professionals who are passionate about pushing the boundaries of what's possible with machine learning.\n\nGain hands-on experience with advanced AI techniques through guided projects in natural language processing, computer vision, reinforcement learning, and more. Our expert mentors provide code reviews, troubleshooting help, and insights from their industry experience.\n\nStay at the forefront of AI innovation with discussions on the latest research papers, frameworks, and ethical considerations. Whether you're building your first neural network or optimizing complex models, our community offers the resources and support you need to excel in the AI field."
  }
];
