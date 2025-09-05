import React, { useState } from 'react';
import { FolderIcon, PlayIcon, FileTextIcon, CheckCircleIcon, AlertCircleIcon, DownloadIcon } from 'lucide-react';

interface ExecutionResult {
  success: boolean;
  message: string;
  reportPath?: string;
  duration?: number;
}

function App() {
  const [selectedFolder, setSelectedFolder] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [progress, setProgress] = useState(0);

  const selectFolder = async () => {
    try {
      // Use webkitdirectory method which works in all contexts including iframes
      const input = document.createElement('input');
      input.type = 'file';
      input.webkitdirectory = true;
      input.onchange = (e) => {
        const files = (e.target as HTMLInputElement).files;
        if (files && files.length > 0) {
          const folderPath = files[0].webkitRelativePath.split('/')[0];
          setSelectedFolder(folderPath);
          setResult(null);
        }
      };
      input.click();
    } catch (error) {
      console.error('Erreur lors de la sélection du dossier:', error);
    }
  };

  const runScript = async () => {
    if (!selectedFolder) return;
    
    setIsRunning(true);
    setProgress(0);
    setResult(null);

    // Simulate script execution with progress
    const steps = [
      'Initialisation du script...',
      'Vérification du synoptique optique...',
      'Contrôle des plans de baie...',
      'Analyse des DFT...',
      'Vérification des plans de boîte...',
      'Contrôle des PGC...',
      'Vérification des CFA...',
      'Analyse du dossier technique...',
      'Génération du rapport Excel...',
      'Finalisation...'
    ];

    const startTime = Date.now();

    for (let i = 0; i < steps.length; i++) {
      setProgress(((i + 1) / steps.length) * 100);
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
    }

    const duration = Math.round((Date.now() - startTime) / 1000);
    
    // Simulate successful execution
    setResult({
      success: true,
      message: `Script exécuté avec succès! Dossier analysé: ${selectedFolder}`,
      reportPath: 'rapport/rapport_controle.xlsx',
      duration
    });
    
    setIsRunning(false);
    setProgress(100);
  };

  const downloadReport = () => {
    // Simulate Excel file download
    const blob = new Blob(['Rapport Excel simulé'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rapport_controle.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Analyseur de Dossiers DOE
          </h1>
          <p className="text-gray-600">
            Sélectionnez un dossier et lancez l'analyse automatisée
          </p>
        </div>

        {/* Folder Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Dossier à analyser
          </label>
          <div className="flex gap-3">
            <div className="flex-1 p-3 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center min-h-[60px]">
              {selectedFolder ? (
                <div className="flex items-center text-gray-700">
                  <FolderIcon className="w-5 h-5 mr-2 text-blue-600" />
                  <span className="font-medium">{selectedFolder}</span>
                </div>
              ) : (
                <span className="text-gray-500">Aucun dossier sélectionné</span>
              )}
            </div>
            <button
              onClick={selectFolder}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 whitespace-nowrap"
            >
              <FolderIcon className="w-5 h-5" />
              Parcourir
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        {isRunning && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progression</span>
              <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Execute Button */}
        <div className="mb-8">
          <button
            onClick={runScript}
            disabled={!selectedFolder || isRunning}
            className={`w-full py-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-3 ${
              !selectedFolder || isRunning
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg'
            }`}
          >
            <PlayIcon className="w-5 h-5" />
            {isRunning ? 'Exécution en cours...' : 'Lancer l\'analyse'}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className={`p-6 rounded-lg border-2 ${
            result.success 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-start gap-3">
              {result.success ? (
                <CheckCircleIcon className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircleIcon className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <h3 className={`font-semibold mb-2 ${
                  result.success ? 'text-green-900' : 'text-red-900'
                }`}>
                  {result.success ? 'Analyse terminée avec succès!' : 'Erreur lors de l\'analyse'}
                </h3>
                <p className={`mb-4 ${
                  result.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {result.message}
                </p>
                
                {result.success && (
                  <div className="space-y-3">
                    <div className="text-sm text-green-700">
                      <strong>Durée d'exécution:</strong> {result.duration}s
                    </div>
                    <div className="text-sm text-green-700">
                      <strong>Rapport généré:</strong> {result.reportPath}
                    </div>
                    
                    <button
                      onClick={downloadReport}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
                    >
                      <DownloadIcon className="w-4 h-4" />
                      Ouvrir le rapport Excel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            Script: main.py | Rapport: rapport_controle.xlsx
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;