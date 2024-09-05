import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import prisma from '@/lib/prisma';

// Initialize Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });



export async function POST(request) {
  try {
    const { prompt} = await request.json();
    const userId=request.headers.get('user-id')
    console.log('Extracted prompt:', prompt);

    // Generate content using Google Generative AI
    const result = await model.generateContent(prompt);
    let responseText = result.response.text();
    console.log('Generated content:', responseText);
    responseText = formatResponse(responseText);
    // Save the chat interaction to the database
    const chat = await prisma.chat.create({
      data: {
      prompt: prompt,
      response: responseText,
      userId: userId, // Assuming you are sending userId with the request
      },
    });
    const chatId = chat.id;
    console.log('Chat ID:', chatId);

    return NextResponse.json({ text: responseText ,chatId});
  } catch (error) {
    console.error('Error generating chat response:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
function formatResponse(text) {
  // Example formatting logic
  return text
    .replace(/## (.+)/g, '<h2>$1</h2>')                // Convert '## Heading' to <h3>
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')  // Convert '**bold**' to <strong>
    .replace(/\* (.+)/g, '<ul><li>$1</li></ul>')       // Convert '* item' to <ul><li>
    .replace(/(\n{2,})/g, '<br/><br/>')                // Convert multiple new lines to <br/><br/>
    .replace(/<ul><li>([^<]+)<\/li><\/ul>/g, '<ul>$1</ul>') // Fix multiple <ul> <li> issues
    .replace(/<\/ul>\s*<ul>/g, '')                     // Remove extra <ul> tags
    .replace(/<\/li>\s*<li>/g, '</li><li>');           // Fix <li> tag issues
}