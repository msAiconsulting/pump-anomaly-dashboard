# Application Logical Flow Diagram

## High-Level System Architecture

```mermaid
graph TB
    subgraph "Data Layer"
        CSV[CSV Data Files]
        DB[(Data Storage)]
    end
    
    subgraph "Processing Layer"
        PARSER[Data Parser]
        ANOMALY[Anomaly Detection]
        METRICS[Metrics Calculator]
    end
    
    subgraph "AI Layer"
        COPILOT[CopilotKit Actions]
        CONTEXT[Context Management]
        VOICE[ElevenLabs Voice AI]
    end
    
    subgraph "UI Layer"
        DASHBOARD[Dashboard Component]
        CHAT[Chat Interface]
        VOICE_CHAT[Voice Chat Widget]
        CHARTS[Data Visualizations]
    end
    
    subgraph "User Interactions"
        USER[User]
        TEXT_IN[Text Input]
        VOICE_IN[Voice Input]
        VISUAL[Visual Analysis]
    end
    
    CSV --> PARSER
    PARSER --> DB
    DB --> ANOMALY
    DB --> METRICS
    
    ANOMALY --> COPILOT
    METRICS --> COPILOT
    COPILOT --> CONTEXT
    
    CONTEXT --> DASHBOARD
    CONTEXT --> CHAT
    CONTEXT --> VOICE_CHAT
    
    USER --> TEXT_IN
    USER --> VOICE_IN
    USER --> VISUAL
    
    TEXT_IN --> CHAT
    VOICE_IN --> VOICE_CHAT
    VISUAL --> DASHBOARD
    
    CHAT --> COPILOT
    VOICE_CHAT --> COPILOT
    DASHBOARD --> COPILOT
```

## Detailed User Interaction Flow

```mermaid
sequenceDiagram
    participant U as User
    participant D as Dashboard
    participant C as Chat Interface
    participant V as Voice Chat
    participant AI as CopilotKit
    participant DATA as Data Layer
    
    U->>D: Opens Dashboard
    D->>DATA: Loads pump data
    DATA->>D: Returns CSV data
    D->>D: Processes & visualizes data
    
    U->>C: Types question about pump data
    C->>AI: Sends user query
    AI->>DATA: Calls getPumpData()
    DATA->>AI: Returns pump metrics
    AI->>C: Generates AI response
    C->>U: Displays answer
    
    U->>V: Activates voice chat
    V->>AI: Connects to same context
    U->>V: Asks voice question
    V->>AI: Processes voice input
    AI->>DATA: Calls getAnomalies()
    DATA->>AI: Returns anomaly data
    AI->>V: Generates voice response
    V->>U: Speaks answer
```

## Component Interaction Flow

```mermaid
flowchart TD
    A[User Action] --> B{Action Type}
    
    B -->|Dashboard View| C[Load Dashboard]
    B -->|Text Chat| D[Open Chat Interface]
    B -->|Voice Chat| E[Activate Voice Widget]
    
    C --> F[Fetch CSV Data]
    F --> G[Parse Data]
    G --> H[Calculate Metrics]
    H --> I[Detect Anomalies]
    I --> J[Render Charts]
    
    D --> K[Initialize CopilotChat]
    K --> L[Set System Message]
    L --> M[Wait for User Input]
    
    E --> N[Load ElevenLabs Script]
    N --> O[Initialize Widget]
    O --> P[Connect to Context]
    
    M --> Q[User Types Question]
    P --> R[User Speaks Question]
    
    Q --> S[Process Text Query]
    R --> T[Process Voice Query]
    
    S --> U[Call CopilotKit Actions]
    T --> U
    
    U --> V{Action Type}
    V -->|getPumpData| W[Fetch Raw Data]
    V -->|getPumpMetrics| X[Calculate Statistics]
    V -->|getAnomalies| Y[Get Anomaly Data]
    
    W --> Z[Generate Response]
    X --> Z
    Y --> Z
    
    Z --> AA[Display in Chat]
    Z --> BB[Speak Response]
    
    AA --> CC[Update Chat History]
    BB --> DD[Update Voice Context]
```

## Data Processing Pipeline

```mermaid
graph LR
    subgraph "Input Data"
        CSV[CSV Files]
        REAL_TIME[Real-time Sensors]
    end
    
    subgraph "Processing Pipeline"
        PARSE[Parse & Validate]
        CLEAN[Clean & Normalize]
        ANALYZE[Statistical Analysis]
        ML[ML Anomaly Detection]
    end
    
    subgraph "Output Data"
        METRICS[Calculated Metrics]
        ANOMALIES[Detected Anomalies]
        TRENDS[Trend Analysis]
    end
    
    subgraph "AI Context"
        ACTIONS[Available Actions]
        CONTEXT[Data Context]
        HISTORY[Conversation History]
    end
    
    CSV --> PARSE
    REAL_TIME --> PARSE
    PARSE --> CLEAN
    CLEAN --> ANALYZE
    ANALYZE --> ML
    
    ANALYZE --> METRICS
    ML --> ANOMALIES
    ANALYZE --> TRENDS
    
    METRICS --> ACTIONS
    ANOMALIES --> ACTIONS
    TRENDS --> ACTIONS
    
    ACTIONS --> CONTEXT
    CONTEXT --> HISTORY
```

## Error Handling and Recovery

```mermaid
flowchart TD
    A[Operation Start] --> B{Check Status}
    
    B -->|Success| C[Continue Operation]
    B -->|Error| D[Error Handler]
    
    D --> E{Error Type}
    E -->|Network Error| F[Retry Logic]
    E -->|Data Error| G[Data Validation]
    E -->|AI Error| H[Fallback Response]
    
    F --> I{Retry Count}
    I -->|< Max| J[Wait & Retry]
    I -->|>= Max| K[Show Error Message]
    
    J --> B
    G --> L[Use Default Data]
    H --> M[Generic Response]
    
    L --> C
    M --> C
    K --> N[User Notification]
    
    C --> O[Operation Complete]
    N --> P[Error Logging]
```

## Deployment and CI/CD Flow

```mermaid
graph TD
    A[Code Changes] --> B[Git Commit]
    B --> C[Push to GitHub]
    C --> D[GitHub Actions Trigger]
    
    D --> E[Build Process]
    E --> F{Node.js Version Check}
    F -->|Compatible| G[Install Dependencies]
    F -->|Incompatible| H[Use Specified Version]
    
    G --> I[Build Application]
    H --> I
    
    I --> J{Build Success}
    J -->|Yes| K[Deploy to Azure]
    J -->|No| L[Build Failure]
    
    K --> M[Azure Static Web Apps]
    M --> N[Environment Variables]
    N --> O[Application Deployed]
    
    L --> P[Error Notification]
    P --> Q[Developer Review]
    Q --> A
```

This comprehensive flow diagram shows:
1. **Data Flow**: How data moves from CSV files through processing to AI and UI
2. **User Interactions**: Different ways users can interact with the system
3. **Component Architecture**: How different parts of the system communicate
4. **Error Handling**: Robust error handling and recovery mechanisms
5. **Deployment Process**: Complete CI/CD pipeline from code to production
