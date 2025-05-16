'use client';

import { useState, useEffect } from "react";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "@aws-amplify/ui-react/styles.css";
import { Authenticator } from '@aws-amplify/ui-react';
import { StorageBrowser } from '../components/StorageBrowser';
import "@/app/app.css";


// Amplify konfigürasyonu sadece bir kez yapılmalı
Amplify.configure(outputs);

// Amplify veri istemcisi
const client = generateClient<Schema>();

export default function Page() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    const subscription = client.models.Todo.observeQuery().subscribe({
      next: ({ items }) => setTodos([...items]),
    });

    return () => subscription.unsubscribe(); // Bellek sızıntısını önle
  }, []);

  function createTodo() {
    const content = window.prompt("Todo content");
    if (content) {
      client.models.Todo.create({ content });
    }
  }

  return (
    <main>
          {/* StorageBrowser Component */}
          <h2>Your Files</h2>
          <StorageBrowser />
    </main>
);
}
