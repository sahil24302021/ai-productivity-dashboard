# **AI Productivity Dashboard — Technical Overview**

> *“An integrated AI-driven productivity environment combining task management, behavioral analytics, and intelligent planning.”*

---

## **1. System Demonstration**
### **Live Demo:**  
🔗 **https://ai-productivity-dashboard-roan.vercel.app/**

---

## **2. Abstract**
The AI Productivity Dashboard is a full-stack platform designed to enhance personal task management through **artificial intelligence**, **data-driven analytics**, and **intuitive interaction systems**.

The system integrates:

- Natural-language task creation  
- Predictive weekly scheduling  
- Statistical productivity analysis  
- High-efficiency UI for rapid workflows  

---

## **3. Technology Stack**

### **Frontend**
- React (TypeScript)
- Vite Runtime
- Zustand state model
- React Query for data synchronization
- TailwindCSS design tokens  
- Recharts visualization layer  

### **Backend**
- Express (TypeScript)
- Prisma ORM
- PostgreSQL relational model
- JWT-secured authentication
- OpenAI LLM pipeline  

### **Deployment Infrastructure**
- Vercel Edge Network (frontend)
- Railway Cloud Compute (backend)
- Railway PostgreSQL Cluster  

---

## **4. System Architecture**
```
┌──────────────────────────┐
│        Frontend          │
│  React + Zustand + UI    │
└──────────────┬───────────┘
               │ HTTPS API
┌──────────────▼───────────┐
│         Backend           │
│ Express + Prisma + AI    │
└──────────────┬───────────┘
               │ SQL
┌──────────────▼───────────┐
│     PostgreSQL DB         │
└───────────────────────────┘
```

---

## **5. Functional Modules**
- **AI Assistant** — reasoning + response generation  
- **Task Engine** — CRUD, reminders, Kanban states  
- **Calendar Engine** — date mapping + event resolution  
- **Analytics Engine** — time-series and performance metrics  

---

## **6. License**
MIT License

