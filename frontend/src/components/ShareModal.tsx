import { useState, useEffect } from 'react';
import { X, Copy, Check, Share2, ExternalLink } from 'lucide-react';
import { Note } from '../types';
import { useApp } from '../context/AppContext';

interface ShareModalProps {
  note: Note;
  onClose: () => void;
}

export function ShareModal({ note, onClose }: ShareModalProps) {
  const { shareNote } = useApp();
  const [copied, setCopied] = useState(false);
  const [shareToken, setShareToken] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadShareToken = async () => {
      try {
        const token = await shareNote(note.id);
        setShareToken(token);
      } catch (error) {
        console.error('Error sharing note:', error);
        alert('Failed to generate share link. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    loadShareToken();
  }, [note.id, shareNote]);

  const shareUrl = `${window.location.origin}?share=${shareToken}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleOpenInNewTab = () => {
    window.open(shareUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-50 rounded-xl shadow-sm">
              <Share2 size={24} className="text-teal-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Share Note</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">{note.title}</h3>
            <p className="text-sm text-gray-600">
              Anyone with the link can view this note
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Share Link
            </label>
            {isLoading ? (
              <div className="text-center py-4 text-gray-500 font-medium">Generating share link...</div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm shadow-sm"
                />
                <button
                  onClick={handleCopy}
                  className={`px-5 py-3 rounded-lg font-medium transition-all flex items-center gap-2 shadow-md ${
                    copied
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-teal-600 text-white hover:bg-teal-700 hover:shadow-lg'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check size={18} />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy size={18} />
                      Copy
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          <div className="bg-gray-50 rounded-lg p-5">
            <h4 className="font-semibold text-gray-900 mb-3 text-sm">Sharing Details</h4>
            <ul className="space-y-2.5 text-sm text-gray-600">
              <li className="flex items-start gap-2.5">
                <span className="text-teal-600 mt-0.5 font-bold">•</span>
                <span>Public link - anyone with this link can view the note</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-teal-600 mt-0.5 font-bold">•</span>
                <span>Read-only access - viewers cannot edit the note</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-teal-600 mt-0.5 font-bold">•</span>
                <span>Link remains active until you delete the note</span>
              </li>
            </ul>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleOpenInNewTab}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <ExternalLink size={18} />
              Preview
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
