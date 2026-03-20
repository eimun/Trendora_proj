import { useState, useEffect } from 'react';
import axios from 'axios';

import { API_URL } from '../config';
import { motion } from 'framer-motion';

function PredictiveDashboard() {
    const [niches] = useState(['tech', 'finance', 'lifestyle', 'health']);
    const [selectedNiche, setSelectedNiche] = useState('tech');
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem('token');

    const fetchPredictions = async (niche, forceRefresh = false) => {
        setLoading(true);

        try {
            let response;

            if (forceRefresh) {
                // Generate new predictions
                response = await axios.post(
                    `${API_URL}/api/predictions/forecast`,
                    { niche },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setPredictions(response.data.predictions || []);
            } else {
                // Get cached predictions
                response = await axios.get(
                    `${API_URL}/api/predictions/cached?niche=${niche}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setPredictions(response.data || []);
            }
        } catch (error) {
            if (error.response?.status === 400) {
                // Not enough historical data — show empty state, no retry
                setPredictions([]);
            } else {
                alert('Failed to fetch predictions');
            }
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchPredictions(selectedNiche);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedNiche]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 transition-colors duration-200">
            <div className="p-8">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-10"
                    >
                        <h1 className="text-5xl font-black text-white mb-3">🔮 Predictive Forecasting</h1>
                        <p className="text-purple-100 dark:text-purple-200 text-xl font-medium">See what will trend before it trends</p>
                    </motion.div>

                    {/* Niche Selector */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mb-8 flex gap-4 justify-center flex-wrap"
                    >
                        {niches.map(niche => (
                            <button
                                key={niche}
                                onClick={() => setSelectedNiche(niche)}
                                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${selectedNiche === niche
                                    ? 'bg-white text-purple-600 dark:bg-gray-800 dark:text-purple-400 scale-105 shadow-2xl'
                                    : 'bg-white/20 dark:bg-gray-800/40 text-white backdrop-blur-sm hover:bg-white/30 dark:hover:bg-gray-800/60'
                                    }`}
                            >
                                {niche.charAt(0).toUpperCase() + niche.slice(1)}
                            </button>
                        ))}
                    </motion.div>

                    {/* Refresh Button */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center mb-10"
                    >
                        <button
                            onClick={() => fetchPredictions(selectedNiche, true)}
                            disabled={loading}
                            className="bg-gradient-to-r from-yellow-400 to-amber-500 dark:from-yellow-500 dark:to-amber-600 text-gray-900 dark:text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-yellow-500/30 disabled:opacity-50 transition-all hover:-translate-y-0.5"
                        >
                            {loading ? '🔄 Neural Network Analyzing...' : '⚡ Run Fresh Predictions'}
                        </button>
                    </motion.div>

                    {/* Predictions Grid */}
                    {loading ? (
                        <div className="text-center text-white py-20 flex flex-col items-center">
                            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
                                <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full mb-4"></div>
                            </motion.div>
                            <div className="animate-pulse text-2xl font-bold font-mono">🤖 AI is correlating market patterns...</div>
                        </div>
                    ) : predictions.length > 0 ? (
                        <motion.div
                            initial="hidden"
                            animate="show"
                            variants={{
                                hidden: { opacity: 0 },
                                show: {
                                    opacity: 1,
                                    transition: { staggerChildren: 0.1 }
                                }
                            }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {predictions.map((pred, index) => (
                                <PredictionCard key={index} prediction={pred} rank={index + 1} />
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white/10 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 rounded-2xl p-16 text-center text-white shadow-2xl"
                        >
                            <p className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">📊 Need More Data</p>
                            <p className="text-xl text-purple-100 dark:text-gray-300">We need 3-5 days of historical data mapped to execute accurate trend forecasts.</p>
                            <p className="mt-4 font-semibold text-yellow-300">Check back tomorrow as the cron job continuously archives data!</p>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}

function PredictionCard({ prediction, rank }) {
    const getRecommendationColor = (rec) => {
        if (rec?.includes('🔥')) return 'border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-500';
        if (rec?.includes('⚡')) return 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-500';
        if (rec?.includes('📈')) return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-500';
        if (rec?.includes('⚠️')) return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-500';
        return 'border-gray-500 bg-gray-50 dark:bg-gray-800 dark:border-gray-600';
    };

    const growthColor = prediction.growth_rate > 10 ? 'text-green-600 dark:text-green-400' :
        prediction.growth_rate > 5 ? 'text-blue-600 dark:text-blue-400' :
            prediction.growth_rate > 0 ? 'text-gray-600 dark:text-gray-400' : 'text-red-600 dark:text-red-400';

    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
            }}
            whileHover={{ y: -5, scale: 1.02 }}
            className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border-t-4 ${getRecommendationColor(prediction.recommendation)} hover:shadow-2xl transition-all relative overflow-hidden`}
        >
            {/* Rank Badge */}
            <div className="absolute top-6 right-6 bg-gradient-to-br from-purple-500 to-indigo-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-black shadow-lg shadow-purple-500/30 text-lg">
                #{rank}
            </div>

            <h3 className="text-2xl font-black mb-6 pr-12 text-gray-900 dark:text-white capitalize">{prediction.keyword}</h3>

            {/* Current vs Predicted */}
            <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Current Volume</p>
                    <p className="text-2xl font-black text-gray-800 dark:text-gray-200">{prediction.current_volume?.toLocaleString()}</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-800/30">
                    <p className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-1">Predicted (7d)</p>
                    <p className="text-2xl font-black text-purple-700 dark:text-purple-300">{prediction.predicted_volume_7d?.toLocaleString()}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
                {/* Growth Rate */}
                <div>
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Velocity</p>
                    <p className={`text-3xl font-black ${growthColor}`}>
                        {prediction.growth_rate > 0 ? '+' : ''}{prediction.growth_rate}%
                    </p>
                </div>

                {/* Predicted Peak */}
                <div>
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Target Peak</p>
                    <p className="text-lg font-bold text-gray-800 dark:text-gray-200">{prediction.predicted_peak_date ? new Date(prediction.predicted_peak_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'N/A'}</p>
                </div>
            </div>

            {/* Confidence Bar */}
            <div className="mb-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex justify-between text-xs mb-2 font-bold">
                    <span className="text-gray-500 dark:text-gray-400 uppercase tracking-wider">AI Confidence</span>
                    <span className={`dark:text-white ${prediction.confidence > 0.8 ? 'text-green-600' : 'text-blue-600'}`}>{(prediction.confidence * 100).toFixed(0)}%</span>
                </div>
                <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${prediction.confidence * 100}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className={`h-full rounded-full ${prediction.confidence > 0.8 ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-blue-400 to-indigo-500'}`}
                    ></motion.div>
                </div>
            </div>

            {/* Recommendation */}
            <div className={`mt-auto p-4 rounded-xl border ${getRecommendationColor(prediction.recommendation).replace('bg-', '').replace('border-', 'bg-opacity-50 border-')}`}>
                <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{prediction.recommendation}</p>
            </div>
        </motion.div>
    );
}

export default PredictiveDashboard;
