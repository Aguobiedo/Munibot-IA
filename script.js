
// --- REFERENCIAS AL DOM ---
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendButton = document.getElementById('send-button');
const quickOptions = document.getElementById('quick-options');
const typingIndicator = document.getElementById('typing-indicator');

// --- ESTADO DEL CHAT ---
let chatHistory = []; 
let currentContext = 'main'; 
let uiDisabled = false; 
let sportsKnowledgeBaseContent = '';

// --- DATOS (RESPUESTAS PREDEFINIDAS) ---
const cannedResponses = { 
    'main': {
        text: "¡Hola! Soy **MuniBot**, tu asistente para la vida estudiantil en Rosario. **¿Cómo puedo ayudarte hoy?**",
        options: ["Alojamiento y Residencias", "Deportes y Bienestar"]
    },
    'alojamiento y residencias': {
        text: "🏡 **Alojamiento y Residencias en Rosario**\nEncontrar un buen lugar para vivir es clave para disfrutar tu vida universitaria. **¿Qué necesitás?**",
        options: ["Residencias universitarias", "Zonas recomendadas", "Precios aproximados", "Consejos para alquilar seguro", "Volver al menú"]
    },
    'residencias universitarias': {
        text: "🏢 **Residencias en Rosario**\nElegí una categoría:",
        options: ["Residencias UNR", "Residencias privadas", "Volver a alojamiento"]
    },
    'residencias unr': {
        text: "🏛️ **Residencias públicas de la UNR**\nSeleccioná una para ver más detalles:",
        options: ["Residencia UNR – Santa Fe 1470", "Residencia UNR – Tucumán 2257", "Residencia UNR – Moreno 450", "Volver a alojamiento"]
    },
    'residencia unr – santa fe 1470': {
        text: "📍 **Santa Fe 1470 (Centro)**\n• Capacidad: **150 plazas**\n• Zona muy conectada\n• Ideal para estudiantes de humanidades y sociales\n\n📩 Contacto: **residenciauniversitaria@unr.edu.ar**\n🌐 Web: **https://unr.edu.ar/programaresidencias/**",
        options: ["Volver a alojamiento"]
    },
    'residencia unr – tucuman 2257': {
        text: "📍 **Tucumán 2257**\n• Enfocada a estudiantes del interior\n• Ambientes amplios y silenciosos\n• Cerca de varias líneas de colectivo\n\n📩 Contacto: **residenciauniversitaria@unr.edu.ar**",
        options: ["Volver a alojamiento"]
    },
    'residencia unr – moreno 450': {
        text: "📍 **Moreno 450 (Planta alta)**\n• Residencia nueva — 30 a 40 plazas\n• Cercana al Parque Urquiza\n• Opción tranquila y segura\n\n📩 Contacto: **residenciauniversitaria@unr.edu.ar**",
        options: ["Volver a alojamiento"]
    },
    'residencias privadas': {
        text: "🏨 **Residencias privadas**\nSeleccioná una para ver detalles:",
        options: ["Village Universitario", "Casa Callao", "Residencia Estudiantil Rosario", "Volver a alojamiento"]
    },
    'village universitario': {
        text: "🏨 **Village Universitario – Sarmiento 1814**\n• Habitaciones individuales y dobles\n• WiFi, limpieza, cocina compartida\n• Muy cerca de varias facultades\n\n📞 Teléfono: **0341 257-6692**\n📧 Mail: **info@villageuniversitario.com**",
        options: ["Volver a alojamiento"]
    },
    'casa callao': {
        text: "🏨 **Casa Callao – Callao 955**\n• Habitaciones amuebladas\n• Espacios comunes amplios\n• Zona tranquila cerca del Centro\n\n",   
        options: ["Volver a alojamiento"]
    },
    'residencia estudiantil rosario': {
        text: "🏨 **Residencia Estudiantil Rosario – Suipacha 921**\n• A 3 cuadras de Medicina\n• Ideal para estudiantes de Ciencias Médicas\n• Habitaciones privadas y compartidas\n\n",
        options: ["Volver a alojamiento"]
    },
    'zonas recomendadas': {
        text: "🗺️ **Zonas recomendadas para vivir**\nSeleccioná un barrio:",
        options: ["Republica de la Sexta", "Echesortu", "Pichincha", "Luis Agote", "Centro", "Lourdes", "Volver a alojamiento"]
    },
    'republica de la sexta': {
        text: "🎓 **República de la Sexta**\n\n• 🗺️ [Ver en el mapa](https://www.google.com/maps/search/?api=1&query=Republica+de+la+Sexta,+Rosario,+Santa+Fe)\n\n⭐ *Por qué conviene*\n• Máxima cercanía al Centro Universitario de Rosario (CUR)\n• Mucha oferta de alquileres\n• Ambiente juvenil y seguro\n• Comercios económicos\n\n🚌 *Servicios y transporte*\n• Líneas: 102, 103, 110, 122\n• Supermercados accesibles\n• Mucha oferta gastronómica",
        options: ["Zonas recomendadas", "Volver a alojamiento"]
    },
    'echesortu': {
        text: "🏘️ **Echesortu**\n\n• 🗺️ [Ver en el mapa](https://www.google.com/maps/search/?api=1&query=Barrio+Echesortu,+Rosario,+Santa+Fe)\n\n⭐ *Por qué conviene*\n• Zona tranquila y familiar\n• Buena seguridad\n• Excelente conectividad\n\n💡 *Servicios*\n• Comercios variados\n• Cercanía al centro\n• Transporte constante",
        options: ["Zonas recomendadas", "Volver a alojamiento"]
    },
    'pichincha': {
        text: "🍻 **Pichincha**\n\n• 🗺️ [Ver en el mapa](https://www.google.com/maps/search/?api=1&query=Barrio+Pichincha,+Rosario,+Santa+Fe)\n\n⭐ *Por qué conviene*\n• Cerca de medicina\n• Mucha oferta gastronómica\n• Excelente transporte\n\n🎉 *Ambiente*\n• Mucha vida nocturna\n• Cafés y espacios culturales\n• Actividades toda la semana",
        options: ["Zonas recomendadas", "Volver a alojamiento"]
    },
    'luis agote': {
        text: "🏠 **Luis Agote**\n\n• 🗺️ [Ver en el mapa](https://www.google.com/maps/search/?api=1&query=Barrio+Luis+Agote,+Rosario,+Santa+Fe)\n\n⭐ *Por qué conviene*\n• Precios accesibles\n• Cerca de varias facultades\n• Buen transporte\n\n💡 *Servicios*\n• Supermercados económicos\n• Fotocopiadoras\n• Zona segura de día",
        options: ["Zonas recomendadas", "Volver a alojamiento"]
    },
    'centro': {
        text: "🏙️ **Centro de Rosario**\n\n• 🗺️ [Ver en el mapa](https://www.google.com/maps/search/?api=1&query=Rosario+Centro,+Rosario,+Santa+Fe)\n\n⭐ *Por qué conviene*\n• Máxima conectividad\n• Cerca de casi todas las facultades\n• Muchísimos servicios\n\n🚌 *Servicios y transporte*\n• Pasan todas las líneas de colectivos\n• Bancos, trámites y comercios\n• Movimiento constante",
        options: ["Zonas recomendadas", "Volver a alojamiento"]
    },
    'lourdes': {
        text: "⛪ **Barrio Lourdes**\n\n• 🗺️ [Ver en el mapa](https://www.google.com/maps/search/?api=1&query=Barrio+Lourdes,+Rosario,+Santa+Fe)\n\n⭐ *Por qué conviene*\n• Muy seguro\n• Cercano a Medicina y UCA\n• Excelente relación calidad/precio\n\n💡 *Servicios*\n• Supermercados grandes\n• Buen transporte\n• Cafeterías y espacios de estudio",
        options: ["Zonas recomendadas", "Volver a alojamiento"]
    },
    'precios aproximados': {
        text: "💰 **Precios aproximados de alquiler (2025)**\nElegí un tipo de alojamiento:",
        options: ["Monoambientes", "1 Dormitorio", "2 Dormitorios", "Volver a alojamiento"]
    },
    'monoambientes': {
        text: "🏠 **Monoambientes**\nRango estimado:\n• **$200.000 – $350.000** por mes\n\nDepende de zona, edificio y servicios.",
        options: ["Volver a alojamiento"]
    },
    '1 dormitorio': {
        text: "🛏️ **Departamentos de 1 dormitorio**\nRango estimado:\n• **$300.000 – $500.000**\n\nLos más caros están en Centro y Pichincha.",
        options: ["Volver a alojamiento"]
    },
    '2 dormitorios': {
        text: "🏘️ **Departamentos de 2 dormitorios**\nRango estimado:\n• **$450.000 – $700.000**\n\nRecomendados para compartir entre 2–3 personas.",
        options: ["Volver a alojamiento"]
    },
    'consejos para alquilar seguro': {
        text: "🔐 **Consejos para alquilar de forma segura**\n• Visitá la propiedad antes de pagar.\n• Pedí contrato por escrito.\n• Verificá identidad del dueño o inmobiliaria.\n• Revisá luz, gas, agua y estado general.\n• Sacá fotos al ingresar.\n\n🆓 **Asesoramiento gratuito para inquilinos (Municipalidad de Rosario)**:\nHacé click acá 👉 [Solicitar Asesoramiento de Alquileres](https://www.rosario.gob.ar/inicio/solicitar-asesoramiento-sobre-alquileres)",
        options: ["Volver a alojamiento"]
    },
    'deportes y bienestar': {
        text: "🏀 **Bienvenido a Deportes y Bienestar**\nRosario ofrece una gran variedad de actividades. Las respuestas de esta sección son generadas por **IA** y pueden no ser totalmente precisas.\n**¿En qué puedo ayudarte?**",
        options: ["Volver al menú"]
    }
};

cannedResponses['volver al menú'] = { ...cannedResponses['main'], text: "Volviendo al menú principal. ¿Qué más necesitas?" };
cannedResponses['volver a alojamiento'] = { ...cannedResponses['alojamiento y residencias'], text: "Volviendo a Alojamiento." };
cannedResponses['volver a deportes'] = { ...cannedResponses['deportes y bienestar'], text: "Volviendo a Deportes y Bienestar." };

// --- FUNCIONES DEL CHAT ---
function normalizeText(text) {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function findCannedResponseKey(text) {
    const keywordMap = {
        'consejos para alquilar seguro': ['estafa', 'contrato', 'inmobiliaria', 'consejos', 'tips alquilar', 'garantia'],
        'residencias universitarias': ['residencia', 'pension', 'siberia', 'maipu', 'unr', 'village'],
        'zonas recomendadas': ['zonas', 'vivir', 'barrios', 'recomendas', 'mudo', 'mudanza', 'donde vivir', 'centro', 'pichincha'],
        'alojamiento y residencias': ['alojamiento', 'alquilar', 'vivienda', 'depto'],
        'deportes y bienestar': ['deporte', 'bienestar', 'clubes', 'yoga', 'entrenar'],
        'volver al menú': ['menu principal', 'volver al menu', 'inicio', 'empezar'],
        'volver a alojamiento': ['volver a alojamiento'],
        'volver a deportes': ['volver a deportes'],
    };

    const prioritizedKeys = Object.keys(keywordMap);
    for (const key of prioritizedKeys) {
        const keywords = keywordMap[key];
        for (const keyword of keywords) {
            if (text.includes(normalizeText(keyword))) {
                return key;
            }
        }
    }
    return null;
}

function addMessage(sender, text, data = {}) {
    // Evitamos guardar los mensajes de carga o errores de sistema en el historial de Gemini
    if (!text.includes("Inicializando") && !text.includes("ERROR FATAL") && !text.includes("Error de configuración")) {
        // En la API de Gemini, los roles válidos para historial son 'user' y 'model'
        const role = sender === 'user' ? 'user' : 'model';
        
        // Evitamos enviar dos roles iguales de manera consecutiva (rompe la API de Gemini)
        if (chatHistory.length === 0 || chatHistory[chatHistory.length - 1].role !== role) {
             chatHistory.push({ role: role, parts: [{ text: text }] });
        } else {
             // Si el rol es el mismo que el anterior, concatenamos al mensaje previo
             chatHistory[chatHistory.length - 1].parts[0].text += `\n${text}`;
        }

        // Mantenemos solo los últimos 10 mensajes de contexto
        if (chatHistory.length > 10) chatHistory.shift();
    }

    const messageElement = document.createElement('div');
    
    // Si viene un ID específico, se lo asignamos
    if (data.id) {
        messageElement.id = data.id;
    }

    let formattedText = text.replace(/\n/g, '<br>');
    formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formattedText = formattedText.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="bot-link">$1</a>');

    messageElement.innerHTML = formattedText;
    messageElement.className = `p-3 max-w-xs md:max-w-md break-words whitespace-pre-wrap ${sender === 'user' ? 'chat-bubble-user ml-auto' : 'chat-bubble-bot mr-auto'}`;

    chatMessages.appendChild(messageElement);

    if (data.image) {
        const imgElement = document.createElement('img');
        imgElement.src = data.image;
        imgElement.alt = "Imagen de chatbot";
        imgElement.className = "mt-2 rounded-lg shadow-md";
        messageElement.appendChild(imgElement);
    }

    quickOptions.innerHTML = '';
    if (data.options && data.options.length > 0) {
        data.options.forEach(optionText => {
            const button = document.createElement('button');
            button.innerText = optionText;
            button.className = "bg-blue-100 text-blue-800 border border-blue-200 rounded-full px-4 py-2 text-sm font-medium hover:bg-blue-200 transition-all";
            button.onclick = () => handleOptionClick(optionText);
            quickOptions.appendChild(button);
        });
    }
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function handleOptionClick(optionText) {
    if (uiDisabled) return;
    addMessage('user', optionText);
    processMessage(optionText);
}

async function handleSend() {
    if (uiDisabled) return;
    const text = chatInput.value.trim();
    if (text === '') return;
    addMessage('user', text);
    chatInput.value = '';
    await processMessage(text);
}

async function processMessage(text) {
    disableUI();
    const lowerCaseText = normalizeText(text.toLowerCase().trim());

    let responseKey = lowerCaseText;
    let cannedMatch = cannedResponses[responseKey] ? responseKey : findCannedResponseKey(lowerCaseText);

    const isSportsContext = currentContext === 'deportes y bienestar' || currentContext.includes('deportes');
    const looksLikeQuestion = text.includes(' ');

    if (cannedMatch && !looksLikeQuestion) {
        const response = cannedResponses[cannedMatch];
        currentContext = cannedMatch;
        setTimeout(() => {
            addMessage('bot', response.text, response);
            enableUI();
        }, 500);
    } else if (cannedMatch && looksLikeQuestion) {
        if (cannedMatch.includes('volver')) {
            const response = cannedResponses[cannedMatch];
            currentContext = cannedMatch;
            setTimeout(() => {
                addMessage('bot', response.text, response);
                enableUI();
            }, 500);
        } else if (isSportsContext) {
            await handleAIResponse(text);
        } else {
            const response = cannedResponses[cannedMatch];
            currentContext = cannedMatch;
            setTimeout(() => {
                addMessage('bot', response.text, response);
                enableUI();
            }, 500);
        }
    } else {
        if (isSportsContext) {
            await handleAIResponse(text);
        } else {
            showTypingIndicator(true);
            const currentOptions = cannedResponses[currentContext]?.options || cannedResponses['main'].options;
            setTimeout(() => {
                addMessage('bot', "Lo siento, solo puedo responder a las opciones del menú en esta sección. Por favor, selecciona un botón o escribe 'Volver al menú'.", { options: currentOptions });
                enableUI();
                showTypingIndicator(false);
            }, 500);
        }
    }
}

async function handleAIResponse(text) {
    if (sportsKnowledgeBaseContent) {
        showTypingIndicator(true);
        try {
            // Pasamos el texto (que ya fue añadido al DOM y al chatHistory) 
            const aiResponse = await callGeminiAPI(sportsKnowledgeBaseContent, true);
            const optionsToShow = cannedResponses['deportes y bienestar'].options;

            addMessage('bot', aiResponse.text, { options: optionsToShow });

            if (aiResponse.sources && aiResponse.sources.length > 0) {
                let sourcesText = "\n\n🔍 **Fuentes consultadas:**\n";
                // Usamos Set para evitar links duplicados
                const uniqueSources = Array.from(new Set(aiResponse.sources.map(s => s.uri)))
                    .map(uri => aiResponse.sources.find(s => s.uri === uri));

                uniqueSources.forEach(source => {
                    sourcesText += `- [${source.title || source.uri}](${source.uri})\n`;
                });
                
                sourcesText = sourcesText.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="bot-link">$1</a>');
                addMessage('bot', sourcesText, { options: optionsToShow });
            }

        } catch (error) {
            console.error("Error IA:", error);
            addMessage('bot', "Lo siento, hubo un problema al conectar. Intenta de nuevo.", { options: cannedResponses['deportes y bienestar'].options });
        } finally {
            showTypingIndicator(false);
            enableUI();
        }
    } else {
        addMessage('bot', "Error de configuración de IA.", { options: [] });
        enableUI();
    }
}

function showTypingIndicator(show) {
    if (show) {
        typingIndicator.classList.remove('hidden');
        chatMessages.scrollTop = chatMessages.scrollHeight;
    } else {
        typingIndicator.classList.add('hidden');
    }
}

function disableUI() {
    uiDisabled = true;
    chatInput.disabled = true;
    sendButton.disabled = true;
    quickOptions.style.pointerEvents = 'none';
    quickOptions.style.opacity = '0.7';
}

function enableUI() {
    uiDisabled = false;
    chatInput.disabled = false;
    sendButton.disabled = false;
    chatInput.focus();
    quickOptions.style.pointerEvents = 'auto';
    quickOptions.style.opacity = '1';
}

// --- API WRAPPER ---
async function retryFetch(url, options, retries = 3, delay = 1000) {
    try {
        return await fetch(url, options);
    } catch (err) {
        if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, delay));
            return retryFetch(url, options, retries - 1, delay * 2);
        } else {
            throw err;
        }
    }
}

async function callGeminiAPI(systemPrompt, useGrounding = false) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY; 
    
    if (!apiKey) {
         throw new Error("API Key no configurada en las variables de entorno.");
    }
    
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
   
    let apiContents = [...chatHistory];
    while (apiContents.length > 0 && apiContents[0].role === 'model') {
        apiContents.shift(); // Eliminamos los mensajes iniciales del bot
    }

    const payload = {
        contents: apiContents, 
        ...(useGrounding ? { tools: [{ googleSearch: {} }] } : {}),
        systemInstruction: {
            parts: [{ text: systemPrompt }]
        },
    };

    const response = await retryFetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        console.error("Detalle del error de la API:", errData);
        throw new Error(`Error de API: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    const candidate = result.candidates?.[0];

    if (candidate && candidate.content?.parts?.[0]?.text) {
        const text = candidate.content.parts[0].text;
        let sources = [];

        if (useGrounding) {
            const metadata = candidate.groundingMetadata;
            if (metadata && metadata.groundingChunks) {
                sources = metadata.groundingChunks
                    .map(chunk => chunk.web)
                    .filter(web => web && web.uri)
                    .map(web => ({
                        uri: web.uri,
                        title: web.title || "Fuente de búsqueda"
                    }));
            }
        }

        return { text, sources };
    } else {
        throw new Error("Respuesta de API inesperada o vacía.");
    }
}

// --- INICIALIZACIÓN ---
async function init() {
    try {
        const initialLoadMsgId = 'munibot-loading-message';
        addMessage('bot', "Inicializando MuniBot...", { id: initialLoadMsgId, options: [] });
        disableUI();

        await new Promise(resolve => setTimeout(resolve, 500));

        const kbElement = document.getElementById('sports-knowledge-base');
        if (kbElement) {
            sportsKnowledgeBaseContent = kbElement.textContent;
        } else {
            console.warn("No se encontró el elemento 'sports-knowledge-base'. La IA podría no tener contexto.");
            sportsKnowledgeBaseContent = "Eres MuniBot, asistente estudiantil.";
        }

        // Eliminación segura del mensaje de inicialización
        const loadingMessage = document.getElementById(initialLoadMsgId);
        if (loadingMessage) {
            loadingMessage.remove();
        }

        const welcome = cannedResponses['main'];
        addMessage('bot', welcome.text, welcome);

        sendButton.addEventListener('click', handleSend);
        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                handleSend();
            }
        });

    } catch (error) {
        console.error("Error al cargar:", error);
        addMessage('bot', "ERROR: Falla de inicialización. Recarga la página.", { options: [] });
    } finally {
        chatInput.focus();
        enableUI();
    }
}

init();