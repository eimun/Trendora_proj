import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { motion } from 'framer-motion';

function StyleTrainer() {
    const [styleStatus, setStyleStatus] = useState(null);
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem('token');

    const checkStatus = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/style/status`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStyleStatus(response.data);
        } catch (error) {
            console.error('Failed to check style status');
        }
    };

    const trainStyle = async () => {
        setLoading(true);
        try {
            const response = await axios.post(
                `${API_URL}/api/style/train`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert(response.data.message);
            checkStatus();
        } catch (error) {
            alert(error.response?.data?.error || 'Training failed');
        }
        setLoading(false);
    };

    const resetStyle = async () => {
        if (!window.confirm('Are you sure you want to reset your style profile?')) return;

        try {
            await axios.post(
                `${API_URL}/api/style/reset`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('Style profile reset!');
            checkStatus();
        } catch (error) {
            alert('Reset failed');
        }
    };

    useEffect(() => {
        checkStatus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors"
        >
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">✨ Your Writing Style</h2>

            {styleStatus?.trained ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 mb-6 rounded-r-lg">
                        <p className="font-semibold text-green-800 dark:text-green-400">✅ Style Profile Active</p>
                        <p className="text-sm text-green-700 dark:text-green-500 mt-1">
                            AI will now write in your unique voice!
                        </p>
                    </div>

                    {styleStatus.profile && (
                        <div className="bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700 p-6 rounded-xl mb-6">
                            <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Your Style Characteristics:</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
                                <div><strong className="text-gray-900 dark:text-white">Tone:</strong> {styleStatus.profile.tone}</div>
                                <div><strong className="text-gray-900 dark:text-white">Vocabulary:</strong> {styleStatus.profile.vocabulary_level}</div>
                                <div><strong className="text-gray-900 dark:text-white">Humor:</strong> {styleStatus.profile.humor_style}</div>
                                <div><strong className="text-gray-900 dark:text-white">Pacing:</strong> {styleStatus.profile.pacing}</div>
                            </div>
                            {styleStatus.profile.signature_phrases && (
                                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                                    <strong className="text-gray-900 dark:text-white text-sm">Signature Phrases:</strong>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {styleStatus.profile.signature_phrases.map((phrase, i) => (
                                            <span key={i} className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-3 py-1 rounded-full text-xs font-medium">
                                                {phrase}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <button
                        onClick={resetStyle}
                        className="text-red-600 dark:text-red-400 hover:text-white border border-red-600 dark:border-red-400 hover:bg-red-600 dark:hover:bg-red-500 px-6 py-2 rounded-lg transition-colors font-medium text-sm"
                    >
                        Reset Style Profile
                    </button>
                </motion.div>
            ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
                        Save at least 3 scripts to train your personalized style profile.
                        The AI will then write content that sounds like YOU!
                    </p>
                    <button
                        onClick={trainStyle}
                        disabled={loading}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 font-bold"
                    >
                        {loading ? 'Analyzing your style...' : '🎓 Train My Style'}
                    </button>
                </motion.div>
            )}
        </motion.div>
    );
}

export default StyleTrainer;
