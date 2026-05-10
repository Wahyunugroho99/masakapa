/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, 
  Camera, 
  Carrot, 
  ChefHat, 
  Wallet, 
  Plus, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  Timer, 
  Zap, 
  ShoppingBasket,
  ChevronRight,
  TrendingUp,
  History,
  Leaf,
  Info,
  Flame,
  Dumbbell,
  Wheat,
  Activity,
  ArrowRight,
  Loader2,
  ScanLine
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Ingredient, 
  Recipe, 
  AIResponse, 
  Freshness, 
  SavingsHistory 
} from './types';
import * as aiService from './services/ai';

// Tab Constants
type Tab = 'beranda' | 'scan' | 'bahan' | 'resep' | 'hemat';

// Fallback Demo Data
const DEMO_RECIPES: AIResponse = {
  isDemo: true,
  summary: {
    totalIngredientsUsed: 5,
    estimatedSavingsIdr: 35000,
    weeklySavingsIdr: 245000,
    monthlySavingsIdr: 1050000,
    wastePrevented: "3.2kg bahan bulan ini",
    bestRecommendation: "Tumis Sawi Tempe Pedas",
    urgentIngredientsSaved: ["Sawi", "Tempe", "Tomat"]
  },
  recipes: [
    {
      name: "Tumis Sawi Tempe Pedas",
      antiWasteScore: 95,
      scoreLabel: "Sangat Anti-Boros",
      estimatedSavingsIdr: 12000,
      cookingTime: "15 Menit",
      difficulty: "Mudah",
      budgetFit: "Cocok untuk Rp20rb",
      toolsNeeded: ["Wajan", "Sutil"],
      whyThisRecipe: "Menggunakan sawi yang hampir layu dan tempe yang sudah ada di kulkas.",
      ingredientsUsed: ["Sawi", "Tempe", "Bawang Merah", "Cabai"],
      optionalIngredients: ["Kecap Manis", "Garam"],
      steps: [
        "Potong sawi dan tempe kecil-kecil.",
        "Tumis bawang dan cabai sampai harum.",
        "Masukkan tempe, aduk sebentar.",
        "Masukkan sawi, beri air sedikit dan kecap.",
        "Masak sampai sawi matang."
      ],
      antiWasteNote: "Sawi layu masih enak jika ditumis pedas seperti ini.",
      nutrition: {
        servings: 2,
        caloriesKcal: 210,
        proteinGrams: 12,
        carbohydrateGrams: 15,
        fatGrams: 8,
        fiberGrams: 4,
        nutritionLabel: "Tinggi Protein & Serat",
        nutritionNote: "Menu kaya protein nabati dari tempe dan serat sawi.",
        balancedMealSuggestion: "Sajikan dengan nasi hangat.",
        disclaimer: "Estimasi gizi bersifat perkiraan."
      },
      shoppingList: {
        availableIngredients: ["Sawi", "Tempe", "Cabai"],
        optionalToBuy: [
          { name: "Kecap Manis", estimatedPriceIdr: 5000 }
        ],
        totalAdditionalCostIdr: 5000,
        shoppingNote: "Gunakan kecap sachet agar lebih hemat."
      }
    },
    {
      name: "Telur Tomat Praktis",
      antiWasteScore: 88,
      scoreLabel: "Anti-Boros",
      estimatedSavingsIdr: 8000,
      cookingTime: "10 Menit",
      difficulty: "Sangat Mudah",
      budgetFit: "Dibawah Rp20rb",
      toolsNeeded: ["Wajan"],
      whyThisRecipe: "Cara tercepat mengolah tomat yang sudah sangat matang.",
      ingredientsUsed: ["Telur", "Tomat", "Bawang Putih"],
      optionalIngredients: ["Daun Bawang"],
      steps: [
        "Kocok telur, goreng orak-arik, sisihkan.",
        "Tumis bawang putih dan potongan tomat sampai layu dan berair.",
        "Masukkan kembali telur, aduk rata.",
        "Bumbui dengan garam dan gula sesuai selera."
      ],
      antiWasteNote: "Tomat yang sudah sangat lembek justru paling enak untuk menu ini.",
      nutrition: {
        servings: 1,
        caloriesKcal: 280,
        proteinGrams: 14,
        carbohydrateGrams: 8,
        fatGrams: 18,
        fiberGrams: 2,
        nutritionLabel: "Cukup Seimbang",
        nutritionNote: "Lengkap dengan protein telur dan vitamin dari tomat.",
        balancedMealSuggestion: "Tambahkan sedikit nasi atau dimakan langsung.",
        disclaimer: "Estimasi gizi bersifat perkiraan."
      },
      shoppingList: {
        availableIngredients: ["Telur", "Tomat"],
        optionalToBuy: [],
        totalAdditionalCostIdr: 0,
        shoppingNote: "Semua bahan tersedia."
      }
    },
    {
      name: "Nasi Goreng Sisa Kulkas",
      antiWasteScore: 82,
      scoreLabel: "Cukup Oke",
      estimatedSavingsIdr: 15000,
      cookingTime: "20 Menit",
      difficulty: "Mudah",
      budgetFit: "Hemat Banget",
      toolsNeeded: ["Wajan"],
      whyThisRecipe: "Solusi klasik untuk menghabiskan nasi sisa semalam dan berbagai potongan sayur.",
      ingredientsUsed: ["Nasi Putih", "Telur", "Bawang Merah", "Cabai"],
      optionalIngredients: ["Sosis", "Bakso"],
      steps: [
        "Haluskan bawang dan cabai.",
        "Tumis bumbu halus sampai matang.",
        "Masukkan telur, buat orak-arik.",
        "Masukkan nasi, aduk dengan api besar.",
        "Tambahkan kecap dan garam, aduk rata."
      ],
      antiWasteNote: "Nasi sisa semalam justru teksturnya paling pas untuk nasi goreng.",
      nutrition: {
        servings: 2,
        caloriesKcal: 450,
        proteinGrams: 10,
        carbohydrateGrams: 65,
        fatGrams: 15,
        fiberGrams: 1,
        nutritionLabel: "Tinggi Karbohidrat",
        nutritionNote: "Energi besar untuk memulai hari.",
        balancedMealSuggestion: "Tambahkan irisan mentimun untuk kesegaran.",
        disclaimer: "Estimasi gizi bersifat perkiraan."
      },
      shoppingList: {
        availableIngredients: ["Nasi", "Telur"],
        optionalToBuy: [
          { name: "Kerupuk", estimatedPriceIdr: 3000 }
        ],
        totalAdditionalCostIdr: 3000,
        shoppingNote: "Kerupuk hanya opsional."
      }
    }
  ]
};

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<Tab>('beranda');
  
  // App State
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [aiSummary, setAiSummary] = useState<AIResponse['summary'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [anakKosMode, setAnakKosMode] = useState(false);
  const [kosBudget, setKosBudget] = useState(20000);
  const [history, setHistory] = useState<SavingsHistory[]>([]);
  
  // UI State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newIngName, setNewIngName] = useState('');
  const [newIngAmount, setNewIngAmount] = useState('');
  const [newIngFreshness, setNewIngFreshness] = useState<Freshness>('Aman');

  // Scan State
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [detectedIngredients, setDetectedIngredients] = useState<{name: string, quantity: string}[]>([]);

  // Local Storage Load
  useEffect(() => {
    const saved = localStorage.getItem('masakApa_ingredients');
    if (saved) setIngredients(JSON.parse(saved));
    
    const savedHistory = localStorage.getItem('masakApa_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  // Local Storage Sync
  useEffect(() => {
    localStorage.setItem('masakApa_ingredients', JSON.stringify(ingredients));
  }, [ingredients]);

  useEffect(() => {
    localStorage.setItem('masakApa_history', JSON.stringify(history));
  }, [history]);

  // Actions
  const addIngredient = (name: string, amount: string, freshness: Freshness) => {
    const newIngredient: Ingredient = {
      id: Date.now().toString(),
      name,
      amount,
      freshness
    };
    setIngredients([...ingredients, newIngredient]);
  };

  const removeIngredient = (id: string) => {
    setIngredients(ingredients.filter(item => item.id !== id));
  };

  const generateRecipes = async () => {
    setLoading(true);
    setActiveTab('resep');
    
    try {
      const data = await aiService.getRecipes(ingredients, { 
        emergencyMode, 
        anakKosMode, 
        kosBudget 
      });
      
      if (!data || !data.recipes || !Array.isArray(data.recipes)) {
        setRecipes(DEMO_RECIPES.recipes);
        setAiSummary(DEMO_RECIPES.summary);
      } else {
        setRecipes(data.recipes);
        setAiSummary(data.summary || DEMO_RECIPES.summary);
        
        // Save to History (Using the first one as best)
        if (data.recipes.length > 0) {
          const best = data.recipes[0];
          const newHistory: SavingsHistory = {
            id: Date.now().toString(),
            date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
            recipeName: best.name,
            antiWasteScore: best.antiWasteScore,
            savingsIdr: best.estimatedSavingsIdr,
            weeklySavingsIdr: data.summary?.weeklySavingsIdr || 0,
            monthlySavingsIdr: data.summary?.monthlySavingsIdr || 0,
            ingredientsUsed: data.summary?.totalIngredientsUsed || 0,
            nutritionLabel: best.nutrition?.nutritionLabel || "N/A"
          };
          setHistory(prev => [newHistory, ...prev]);
        }
      }
    } catch (error) {
      console.error(error);
      setRecipes(DEMO_RECIPES.recipes);
      setAiSummary(DEMO_RECIPES.summary);
    } finally {
      setLoading(false);
    }
  };

  const handleScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanning(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setCapturedImage(base64);
      
      try {
        const detected = await aiService.scanIngredients(base64);

        if (!detected || !Array.isArray(detected)) {
          setDetectedIngredients([
            { name: "Telur", quantity: "2 butir" },
            { name: "Tomat", quantity: "1 buah" },
            { name: "Sawi", quantity: "1 ikat" }
          ]);
        } else {
          setDetectedIngredients(detected.map((d: any) => ({ 
            name: d.name || "Bahan", 
            quantity: d.estimatedQuantity || d.amount || "Secukupnya" 
          })));
        }
      } catch (err) {
        console.error(err);
        setDetectedIngredients([
          { name: "Telur", quantity: "2 butir" },
          { name: "Tomat", quantity: "1 buah" },
          { name: "Sawi", quantity: "1 ikat" }
        ]);
      } finally {
        setScanning(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const addDetectedIngredients = () => {
    const newItems = detectedIngredients.map(d => ({
      id: Math.random().toString(36).substr(2, 9),
      name: d.name,
      amount: d.quantity,
      freshness: 'Aman' as Freshness
    }));
    setIngredients([...ingredients, ...newItems]);
    setDetectedIngredients([]);
    setCapturedImage(null);
    setActiveTab('bahan');
  };

  return (
    <div className="min-h-screen pb-24 md:pb-0 md:pl-0">
      {/* Top Mobile Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-slate-100 md:hidden">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
            <ChefHat className="text-white w-5 h-5" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-primary-600">MasakApa</span>
        </div>
        <div className="px-2 py-1 bg-primary-100 rounded-full text-[10px] font-bold text-primary-700">
          AI ANTI-BOROS
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'beranda' && (
            <motion.div 
              key="beranda"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <span className="inline-block px-3 py-1 bg-secondary-50 text-secondary-600 text-xs font-bold rounded-full">
                  #DariIsiKulkasJadiHemat
                </span>
                <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 leading-tight">
                  Masak dari bahan yang <br/><span className="text-primary-600">sudah kamu punya.</span>
                </h1>
                <p className="text-slate-500 text-lg max-w-lg leading-relaxed">
                  MasakApa membantu kamu menemukan resep hemat, cepat, bergizi, dan anti-boros berdasarkan isi kulkasmu.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button 
                    onClick={() => setActiveTab('bahan')}
                    className="px-8 py-4 bg-primary-600 text-white font-bold rounded-2xl shadow-lg shadow-primary-500/20 hover:bg-primary-700 transition-all flex items-center justify-center gap-2 group"
                  >
                    Mulai Masak <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button 
                    onClick={() => setActiveTab('scan')}
                    className="px-8 py-4 bg-white text-slate-700 border border-slate-200 font-bold rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                  >
                    <Camera className="w-5 h-5" /> Scan Bahan
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { icon: Timer, label: "Resep AI", value: "3", sub: "Rekomendasi" },
                  { icon: Zap, label: "Skor Anti-Boros", value: "AI", sub: "Optimal" },
                  { icon: Wallet, label: "Estimasi Hemat", value: "IDR", sub: "Signifikan" },
                  { icon: Activity, label: "Nilai Gizi", value: "Porsi", sub: "Estimasi" },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-4 rounded-3xl border border-slate-100 card-shadow">
                    <stat.icon className="w-6 h-6 text-primary-500 mb-2" />
                    <div className="text-xs text-slate-400 font-semibold mb-1 uppercase tracking-wider">{stat.label}</div>
                    <div className="text-xl font-bold text-slate-800">{stat.value}</div>
                    <div className="text-[10px] text-slate-400 font-medium">{stat.sub}</div>
                  </div>
                ))}
              </div>

              <div className="bg-primary-50 p-6 rounded-[2rem] border border-primary-100 flex items-start gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                  <Leaf className="text-primary-500 w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-primary-900 mb-1">Dampak Positif</h3>
                  <p className="text-primary-700/80 text-sm leading-relaxed">
                    Setiap resep yang kamu buat menyelamatkan bahan makanan dari tempat sampah. Lebih hemat uang, lebih bijak belanja.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'scan' && (
            <motion.div 
              key="scan"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-display font-bold">Scan Isi Kulkas</h2>
                <p className="text-slate-500 text-sm">Ambil foto atau upload isi kulkasmu, AI akan mendeteksi bahannya.</p>
              </div>

              {!capturedImage ? (
                <div className="relative group">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleScan}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="aspect-[4/3] border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center gap-4 bg-white hover:border-primary-400 hover:bg-primary-50/30 transition-all">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Camera className="w-8 h-8 text-slate-400" />
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-slate-700">Klik untuk Ambil Foto</p>
                      <p className="text-xs text-slate-400">Pastikan pencahayaan cukup terang</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="relative aspect-video rounded-[2rem] overflow-hidden border border-slate-200">
                    <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
                    {scanning && (
                      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white gap-4 backdrop-blur-sm">
                        <Loader2 className="w-10 h-10 animate-spin" />
                        <p className="font-bold animate-pulse">Mengenali Bahan...</p>
                      </div>
                    )}
                  </div>

                  {detectedIngredients.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="font-bold text-lg flex items-center gap-2">
                        <Zap className="w-5 h-5 text-secondary-500" /> Hasil Deteksi
                      </h3>
                      <div className="grid grid-cols-1 gap-2">
                        {detectedIngredients.map((item, i) => (
                          <div key={i} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                            <span className="font-bold text-slate-700">{item.name}</span>
                            <span className="text-sm text-slate-400">{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-3">
                        <button 
                          onClick={() => {setCapturedImage(null); setDetectedIngredients([]);}}
                          className="flex-1 py-4 bg-slate-100 text-slate-700 font-bold rounded-2xl"
                        >
                          Ulangi
                        </button>
                        <button 
                          onClick={addDetectedIngredients}
                          className="flex-[2] py-4 bg-primary-600 text-white font-bold rounded-2xl shadow-lg shadow-primary-500/20"
                        >
                          Tambah ke Dapur
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'bahan' && (
            <motion.div 
              key="bahan"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-display font-bold">Isi Dapurmu</h2>
                  <p className="text-slate-500 text-sm">Update bahan yang ada sekarang.</p>
                </div>
                <button 
                  onClick={() => setShowAddForm(!showAddForm)}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all ${showAddForm ? 'bg-slate-200 text-slate-600' : 'bg-primary-600 text-white shadow-primary-500/20'}`}
                >
                  {showAddForm ? <Trash2 className="w-6 h-6" /> : <Plus className="w-8 h-8" />}
                </button>
              </div>

              {/* Manual Add Form */}
              <AnimatePresence>
                {showAddForm && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-white p-6 rounded-[2rem] border border-primary-100 card-shadow space-y-4 mb-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Nama Bahan</label>
                          <input 
                            value={newIngName}
                            onChange={(e) => setNewIngName(e.target.value)}
                            placeholder="Contoh: Telur Ayam"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Jumlah</label>
                          <input 
                            value={newIngAmount}
                            onChange={(e) => setNewIngAmount(e.target.value)}
                            placeholder="Contoh: 3 butir"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Kesegaran</label>
                        <div className="flex gap-2">
                          {(['Aman', 'Segera dipakai', 'Hampir kedaluwarsa'] as Freshness[]).map(status => (
                            <button
                              key={status}
                              onClick={() => setNewIngFreshness(status)}
                              className={`flex-1 py-3 text-[10px] font-bold rounded-xl border transition-all ${newIngFreshness === status ? 'bg-primary-600 border-primary-600 text-white' : 'bg-white border-slate-100 text-slate-500'}`}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          if (newIngName && newIngAmount) {
                            addIngredient(newIngName, newIngAmount, newIngFreshness);
                            setNewIngName('');
                            setNewIngAmount('');
                            setShowAddForm(false);
                          }
                        }}
                        className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-primary-600 transition-colors"
                      >
                        Tambah ke Daftar
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-4">
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 card-shadow space-y-6">
                  <div className="flex items-center justify-between p-4 bg-red-50/50 rounded-2xl border border-red-100">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-6 bg-white rounded-full relative border transition-colors ${emergencyMode ? 'border-red-500 bg-red-500' : 'border-slate-200'}`} 
                        onClick={() => setEmergencyMode(!emergencyMode)}>
                        <div className={`absolute top-1 w-4 h-4 rounded-full transition-all ${emergencyMode ? 'left-5 bg-white' : 'left-1 bg-slate-300'}`} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-red-900">Mode Kulkas Darurat</div>
                        <div className="text-[10px] text-red-700/70">Prioritaskan bahan segera kedaluwarsa</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-primary-50/50 rounded-2xl border border-primary-100 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-6 bg-white rounded-full relative border transition-colors ${anakKosMode ? 'border-primary-500 bg-primary-500' : 'border-slate-200'}`} 
                        onClick={() => setAnakKosMode(!anakKosMode)}>
                        <div className={`absolute top-1 w-4 h-4 rounded-full transition-all ${anakKosMode ? 'left-5 bg-white' : 'left-1 bg-slate-300'}`} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-primary-900">Mode Anak Kos</div>
                        <div className="text-[10px] text-primary-700/70">Murah, Praktis, & Alat Terbatas</div>
                      </div>
                    </div>
                    
                    {anakKosMode && (
                      <div className="flex gap-2 pt-2">
                        {[10000, 20000, 30000].map(budget => (
                          <button 
                            key={budget}
                            onClick={() => setKosBudget(budget)}
                            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${kosBudget === budget ? 'bg-primary-600 text-white' : 'bg-white text-primary-600 border border-primary-200'}`}
                          >
                            Rp{budget/1000}rb
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {ingredients.length === 0 ? (
                    <div className="text-center py-12 bg-white/50 rounded-[2rem] border-2 border-dashed border-slate-200">
                      <ShoppingBasket className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-400 font-medium">Dapurmu masih kosong.</p>
                      <button onClick={() => addIngredient('Telur', '2 butir', 'Aman')} className="text-primary-600 text-sm font-bold underline mt-2">Tambah Contoh</button>
                    </div>
                  ) : (
                    ingredients.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 card-shadow group">
                        <div className="flex items-center gap-4">
                          <div className={`w-2 h-10 rounded-full ${item.freshness === 'Aman' ? 'bg-green-400' : item.freshness === 'Segera dipakai' ? 'bg-amber-400' : 'bg-red-500'}`} />
                          <div>
                            <div className="font-bold text-slate-800">{item.name}</div>
                            <div className="text-xs text-slate-400 flex items-center gap-1.5">
                              {item.amount} • 
                              <button 
                                onClick={() => {
                                  const stages: Freshness[] = ['Aman', 'Segera dipakai', 'Hampir kedaluwarsa'];
                                  const currentIdx = stages.indexOf(item.freshness);
                                  const nextIdx = (currentIdx + 1) % stages.length;
                                  setIngredients(ingredients.map(ing => ing.id === item.id ? {...ing, freshness: stages[nextIdx]} : ing));
                                }}
                                className="hover:underline"
                              >
                                {item.freshness}
                              </button>
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => removeIngredient(item.id)}
                          className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {ingredients.length > 0 && (
                  <button 
                    onClick={generateRecipes}
                    className="w-full py-5 bg-primary-600 text-white font-bold rounded-[2rem] shadow-xl shadow-primary-500/20 text-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                  >
                    <Zap className="w-6 h-6 fill-white" /> Cari Menu Anti-Boros
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'resep' && (
            <motion.div 
              key="resep"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8 pb-12"
            >
              {loading ? (
                <div className="text-center py-24 space-y-6">
                  <div className="relative w-24 h-24 mx-auto">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 border-4 border-primary-100 border-t-primary-500 rounded-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ChefHat className="w-10 h-10 text-primary-500" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-800">Meracik Resep Paling Hemat...</h3>
                    <p className="text-slate-500 text-sm animate-pulse">Menghitung gizi dan sisa belanjaan anda</p>
                  </div>
                </div>
              ) : recipes.length === 0 ? (
                <div className="text-center py-24 bg-white/50 rounded-[2rem] border-2 border-dashed border-slate-200">
                  <ChefHat className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-400 font-medium">Belum ada resep.</p>
                  <button onClick={() => setActiveTab('bahan')} className="text-primary-600 font-bold mt-2">Update Bahan Terlebih Dahulu</button>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-display font-bold">Rekomendasi AI</h2>
                      <div className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-bold rounded-full">
                        {recipes.length} Variasi Menu
                      </div>
                    </div>
                    
                    {aiSummary && (
                      <div className="bg-slate-900 p-6 rounded-[2rem] text-white space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Dashboard Hemat</span>
                          <TrendingUp className="w-4 h-4 text-primary-400" />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <div className="text-3xl font-display font-bold">Rp{aiSummary.estimatedSavingsIdr.toLocaleString('id-ID')}</div>
                            <div className="text-[10px] text-slate-400 font-medium">Hemat Hari Ini</div>
                          </div>
                          <div>
                            <div className="text-3xl font-display font-bold text-primary-400">Rp{aiSummary.monthlySavingsIdr.toLocaleString('id-ID')}</div>
                            <div className="text-[10px] text-slate-400 font-medium">Potensi Hemat/Bulan</div>
                          </div>
                        </div>
                        <div className="pt-2 flex items-center gap-2 text-xs text-slate-300">
                          <Leaf className="w-3.5 h-3.5 text-primary-500" /> 
                          {aiSummary.wastePrevented}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-12">
                    {recipes.map((recipe, i) => (
                      <div key={i} className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 card-shadow recipe-gradient">
                        <div className="p-8 space-y-8">
                          {/* Header */}
                          <div className="space-y-4">
                            <div className="flex flex-wrap items-center gap-2">
                              {i === 0 && (
                                <span className="px-3 py-1 bg-secondary-500 text-white text-[10px] font-black uppercase rounded-full tracking-tighter">Rekomendasi Terbaik</span>
                              )}
                              <span className="px-3 py-1 bg-primary-100 text-primary-700 text-[10px] font-black uppercase rounded-full tracking-tighter">{recipe.difficulty}</span>
                              <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black uppercase rounded-full tracking-tighter">{recipe.cookingTime}</span>
                            </div>
                            <h3 className="text-3xl font-display font-bold leading-tight">{recipe.name}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">{recipe.whyThisRecipe}</p>
                          </div>

                          {/* Scores & Stats */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-5 bg-white border border-slate-100 rounded-3xl space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-400 uppercase">Skor Anti-Boros</span>
                                <span className={`text-xs font-black ${recipe.antiWasteScore > 80 ? 'text-primary-600' : 'text-amber-500'}`}>{recipe.antiWasteScore}/100</span>
                              </div>
                              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  whileInView={{ width: `${recipe.antiWasteScore}%` }}
                                  className={`h-full ${recipe.antiWasteScore > 80 ? 'bg-primary-500' : 'bg-amber-500'}`} 
                                />
                              </div>
                              <div className="text-[10px] text-slate-400 font-medium">{recipe.scoreLabel} • {recipe.antiWasteNote}</div>
                            </div>

                            <div className="p-5 bg-primary-600 text-white rounded-3xl space-y-1">
                                <div className="text-[10px] font-bold uppercase opacity-60">Hemat Dari Kulkas</div>
                                <div className="text-2xl font-display font-bold">Rp{recipe.estimatedSavingsIdr.toLocaleString('id-ID')}</div>
                                <div className="text-[10px] opacity-80">{recipe.budgetFit}</div>
                            </div>
                          </div>

                          {/* Ingredients & Steps */}
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-4">
                              <h4 className="font-bold flex items-center gap-2">
                                <ShoppingBasket className="w-5 h-5 text-primary-500" /> Bahan Utama
                              </h4>
                              <ul className="space-y-2">
                                {recipe.ingredientsUsed.map((ing, idx) => (
                                  <li key={idx} className="flex items-center gap-3 text-sm text-slate-600 p-2 bg-slate-50 rounded-xl">
                                    <CheckCircle2 className="w-4 h-4 text-primary-500 shrink-0" /> {ing}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="space-y-4">
                              <h4 className="font-bold flex items-center gap-2">
                                <Timer className="w-5 h-5 text-secondary-500" /> Cara Masak
                              </h4>
                              <div className="space-y-4">
                                {recipe.steps.map((step, idx) => (
                                  <div key={idx} className="flex gap-4">
                                    <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[10px] font-black shrink-0">{idx+1}</div>
                                    <p className="text-sm text-slate-600 leading-relaxed">{step}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Nutrition Grid */}
                          <div className="bg-white border-2 border-primary-50 rounded-[2rem] p-6 space-y-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Activity className="w-5 h-5 text-primary-500" />
                                <h4 className="font-bold">Estimasi Nilasi Gizi</h4>
                              </div>
                              <span className="px-3 py-1 bg-primary-100 text-primary-700 text-[10px] font-bold rounded-full">
                                {recipe.nutrition.nutritionLabel}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {[
                                { icon: Flame, label: "Kalori", value: `${recipe.nutrition.caloriesKcal} kkal` },
                                { icon: Dumbbell, label: "Protein", value: `${recipe.nutrition.proteinGrams} g` },
                                { icon: Wheat, label: "Karb", value: `${recipe.nutrition.carbohydrateGrams} g` },
                                { icon: Activity, label: "Lemak", value: `${recipe.nutrition.fatGrams} g` },
                              ].map((gizi, idx) => (
                                <div key={idx} className="p-3 bg-slate-50 rounded-2xl flex items-center gap-3 shadow-sm border border-slate-100">
                                  <gizi.icon className="w-4 h-4 text-slate-400" />
                                  <div>
                                    <div className="text-[10px] text-slate-400 font-bold">{gizi.label}</div>
                                    <div className="text-xs font-bold text-slate-700">±{gizi.value}</div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="p-4 bg-primary-50/30 rounded-2xl border border-primary-100">
                              <p className="text-xs text-primary-800 leading-relaxed italic">
                                "{recipe.nutrition.nutritionNote}"
                              </p>
                              <div className="mt-2 flex items-center gap-2 text-[10px] text-primary-600 font-bold">
                                <Info className="w-3 h-3" /> {recipe.nutrition.balancedMealSuggestion}
                              </div>
                            </div>
                          </div>

                          {/* Shopping List */}
                          <div className="p-6 bg-slate-900 rounded-[2rem] text-white lg:flex lg:items-center lg:justify-between lg:gap-8 space-y-6 lg:space-y-0">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <ShoppingBasket className="w-5 h-5 text-secondary-500" />
                                <h4 className="font-bold">Smart Shopping List</h4>
                              </div>
                              <p className="text-xs text-slate-400">{recipe.shoppingList.shoppingNote}</p>
                            </div>
                            
                            {recipe.shoppingList.optionalToBuy.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {recipe.shoppingList.optionalToBuy.map((item, idx) => (
                                  <div key={idx} className="px-3 py-2 bg-slate-800 rounded-xl flex items-center gap-2 text-[10px]">
                                    <span className="font-bold text-slate-200">{item.name}</span>
                                    <span className="text-primary-400">±Rp{item.estimatedPriceIdr/1000}rb</span>
                                  </div>
                                ))}
                                <div className="px-4 py-2 border border-primary-500/30 text-primary-400 rounded-xl text-xs font-bold flex items-center gap-2">
                                  Total: Rp{recipe.shoppingList.totalAdditionalCostIdr.toLocaleString()}
                                </div>
                              </div>
                            ) : (
                              <div className="px-4 py-3 bg-primary-500/20 text-primary-400 border border-primary-500/30 rounded-2xl text-xs font-bold flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4" /> Semuanya Tersedia
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          )}

          {activeTab === 'hemat' && (
            <motion.div 
              key="hemat"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h2 className="text-2xl font-display font-bold">Riwayat Hemat</h2>
                <p className="text-slate-500 text-sm">Lihat dampak nyata dari setiap resep anti-borosmu.</p>
              </div>

              {history.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-primary-600 p-6 rounded-3xl text-white">
                    <History className="w-6 h-6 mb-4 opacity-70" />
                    <div className="text-2xl font-display font-bold">{history.length}</div>
                    <div className="text-[10px] font-medium opacity-70 uppercase tracking-wider">Total Resep</div>
                  </div>
                  <div className="bg-slate-900 p-6 rounded-3xl text-white">
                    <Wallet className="w-6 h-6 mb-4 text-primary-500" />
                    <div className="text-2xl font-display font-bold">
                      Rp{(history.reduce((acc, current) => acc + current.savingsIdr, 0)).toLocaleString('id-ID')}
                    </div>
                    <div className="text-[10px] font-medium opacity-70 uppercase tracking-wider">Total Hemat</div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {history.length === 0 ? (
                  <div className="text-center py-24 bg-white/50 rounded-[2rem] border-2 border-dashed border-slate-200">
                    <History className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-400 font-medium tracking-tight">Belum ada riwayat memasak.</p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between px-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Catatan Terakhir</span>
                      <button 
                        onClick={() => {if(confirm('Hapus semua riwayat?')) setHistory([]);}} 
                        className="text-[10px] font-bold text-red-500 underline"
                      >
                        Hapus Semua
                      </button>
                    </div>
                    <div className="space-y-3">
                      {history.map((item, idx) => (
                        <div key={idx} className="bg-white p-5 rounded-[2rem] border border-slate-100 card-shadow flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="text-[10px] text-slate-400 font-bold">{item.date}</div>
                            <h4 className="font-bold text-slate-800 leading-tight">{item.recipeName}</h4>
                            <div className="flex gap-2">
                              <span className="text-[10px] px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full font-bold">{item.nutritionLabel}</span>
                              <span className="text-[10px] text-slate-400 font-medium">Skor: {item.antiWasteScore}/100</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-display font-bold text-primary-600">+Rp{item.savingsIdr.toLocaleString()}</div>
                            <div className="text-[10px] text-slate-400">Tersimpan</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 glass-morphism px-8 pt-4 pb-8 md:px-12 md:pb-6">
        <div className="max-w-md mx-auto flex items-center justify-between relative">
          <NavItem icon={<Home size={22} />} label="Beranda" active={activeTab === 'beranda'} onClick={() => setActiveTab('beranda')} />
          <NavItem icon={<ScanLine size={22} />} label="Scan" active={activeTab === 'scan'} onClick={() => setActiveTab('scan')} />
          
          <div className="relative -top-10">
            <button 
              onClick={() => setActiveTab('bahan')}
              className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all border-4 border-white ${activeTab === 'bahan' ? 'bg-primary-600 scale-110 shadow-primary-500/40' : 'bg-slate-900 shadow-slate-900/30'}`}
            >
              <Plus size={32} className="text-white" />
            </button>
            <div className="absolute top-16 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-500 mt-2">Dapur</div>
          </div>

          <NavItem icon={<ChefHat size={22} />} label="Resep" active={activeTab === 'resep'} onClick={() => setActiveTab('resep')} />
          <NavItem icon={<Wallet size={22} />} label="Hemat" active={activeTab === 'hemat'} onClick={() => setActiveTab('hemat')} />
        </div>
      </nav>
      
      <p className="text-[10px] text-center text-slate-300 py-8 hidden md:block">
        Dibangun dengan Google AI Studio + Gemini API. Siap dirilis global via Cloud Run.
      </p>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 transition-all outline-none ${active ? 'text-primary-600 scale-110' : 'text-slate-400'}`}
    >
      <div className={`${active ? 'text-primary-500 animate-in fade-in zoom-in' : ''}`}>
        {icon}
      </div>
      <span className={`text-[10px] font-bold tracking-tighter ${active ? 'opacity-100' : 'opacity-70'}`}>{label}</span>
      {active && <motion.div layoutId="nav-pill" className="w-1 h-1 bg-primary-600 rounded-full mt-0.5" />}
    </button>
  );
}

