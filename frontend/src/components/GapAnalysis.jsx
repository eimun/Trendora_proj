import { useState, useEffect } from 'react';
import axios from 'axios';

import { API_URL } from '../config';
import { motion, AnimatePresence } from 'framer-motion';

function GapAnalysis() {
    const [competitors, setCompetitors] = useState([]);
    const [gaps, setGaps] = useState([]);
    const [selectedNiche, setSelectedNiche] = useState('tech');
    const [loading, setLoading] = useState(false);

    // Form state
    const [channelId, setChannelId] = useState('');
    const [channelName, setChannelName] = useState('');

    const token = localStorage.getItem('token');

    const fetchCompetitors = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/gaps/list-competitors`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCompetitors(response.data);
        } catch (error) {
            console.error('Failed to fetch competitors');
        }
    };

    const addCompetitor = async (e) => {
        e.preventDefault();

        try {
            await axios.post(
                `${API_URL}/api/gaps/add-competitor`,
                { channel_id: channelId, channel_name: channelName, niche: selectedNiche },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert('Competitor added!');
            setChannelId('');
            setChannelName('');
            fetchCompetitors();
        } catch (error) {
            alert('Failed to add competitor');
        }
    };

    const analyzeGaps = async () => {
        setLoading(true);
        try {
            const response = await axios.post(
                `${API_URL}/api/gaps/analyze`,
                { niche: selectedNiche },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setGaps(response.data.gaps);
        } catch (error) {
            alert('Analysis failed');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCompetitors();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
            <div className="p-8">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">🎯 Trend Gap Analysis</h1>
                    </motion.div>

                    {/* Add Competitor Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8"
                    >
                        <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Track Competitors</h2>
                        <form onSubmit={addCompetitor} className="flex gap-4 flex-wrap">
                            <input
                                type="text"
                                placeholder="YouTube Channel ID"
                                value={channelId}
                                onChange={(e) => setChannelId(e.target.value)}
                                className="flex-1 min-w-[200px] p-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 dark:text-white outline-none transition-all"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Channel Name"
                                value={channelName}
                                onChange={(e) => setChannelName(e.target.value)}
                                className="flex-1 min-w-[200px] p-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 dark:text-white outline-none transition-all"
                                required
                            />
                            <select
                                value={selectedNiche}
                                onChange={(e) => setSelectedNiche(e.target.value)}
                                className="p-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 dark:text-white outline-none transition-all"
                            >
                                <option value="tech">Tech</option>
                                <option value="finance">Finance</option>
                                <option value="lifestyle">Lifestyle</option>
                                <option value="health">Health</option>
                            </select>
                            <button type="submit" className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/30 transition-all hover:-translate-y-0.5">
                                Add Target
                            </button>
                        </form>

                        {/* Competitors List */}
                        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                            <h3 className="font-semibold mb-3 text-gray-700 dark:text-gray-300">Tracking Networks ({competitors.length}):</h3>
                            <div className="flex flex-wrap gap-3">
                                <AnimatePresence>
                                    {competitors.map(comp => (
                                        <motion.span
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            key={comp.id}
                                            className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-medium border border-blue-100 dark:border-blue-800/30"
                                        >
                                            {comp.channel_name} <span className="text-blue-400 dark:text-blue-600 text-xs ml-1 uppercase">{comp.niche}</span>
                                        </motion.span>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>

                    {/* Analyze Button */}
                    <motion.button
                        whileHover={!loading && competitors.length > 0 ? { scale: 1.02 } : {}}
                        onClick={analyzeGaps}
                        disabled={loading || competitors.length === 0}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-emerald-500/30 disabled:from-gray-400 disabled:to-gray-500 disabled:shadow-none transition-all mb-10"
                    >
                        {loading ? '🔍 Sweeping competitor networks...' : '⚡ Find Untapped Opportunities'}
                    </motion.button>

                    {/* Gap Results */}
                    {gaps.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
                        >
                            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">📊 Opportunity Report</h2>
                            <div className="space-y-4">
                                {gaps.map((gap, index) => (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        key={index}
                                        className="border-l-4 border-emerald-500 pl-5 py-4 bg-gray-50 dark:bg-gray-700/50 rounded-r-xl border-y border-r border-gray-100 dark:border-gray-700 shadow-sm"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize mb-1">{gap.keyword}</h3>
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    Volume: <span className="text-gray-900 dark:text-gray-200">{gap.volume?.toLocaleString()}</span> |
                                                    Coverage: <span className="text-gray-900 dark:text-gray-200">{gap.competitor_coverage}/{gap.total_competitors}</span> channels
                                                </p>
                                            </div>
                                            <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider ${gap.opportunity === 'High' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' :
                                                gap.opportunity === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400' :
                                                    'bg-gray-200 text-gray-700 dark:bg-gray-600/30 dark:text-gray-400'
                                                }`}>
                                                {gap.opportunity} Target
                                            </span>
                                        </div>
                                        <div className="mt-4">
                                            <div className="bg-gray-200 dark:bg-gray-600 rounded-full h-2 overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${gap.gap_score * 100}%` }}
                                                    transition={{ duration: 1 }}
                                                    className="bg-emerald-500 h-2 rounded-full"
                                                ></motion.div>
                                            </div>
                                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-2">Gap Index: {(gap.gap_score * 100).toFixed(0)} / 100</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default GapAnalysis;
