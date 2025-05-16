
// Main export file for the RAG (Retrieval-Augmented Generation) utilities

// Export project data functions
export { 
  setProjectData,
  getProjectData
} from './projectDataStore';

// Export document processing functions
export { 
  processDocumentForRAG,
  getDocumentChunks
} from './documentProcessor';

// Export search and response generation functions
export {
  searchRelevantChunks
} from './contentSearch';

export {
  generateRAGResponse
} from './responseGenerator';

// Export report generation
export {
  generateReport
} from './reportGenerator';

// Export extractors
export {
  extractMainTopics
} from './topicExtractor';

export {
  extractKeyMetrics
} from './metricsExtractor';
