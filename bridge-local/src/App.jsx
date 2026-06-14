import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, ShieldCheck, Lock, Plus, Search, Flame, Trophy,
  Truck, Clock, X, CheckCircle2, AlertCircle, MapPin,
  ArrowRight, LogOut, User, Building2, FileText, Banknote
} from 'lucide-react';

// =============================================================================
// 1. DATA & BACKEND SIMULATION (Local Storage)
// =============================================================================
const CATEGORIES = ['Food', 'Education', 'Clothes', 'Others'];
const LOGISTICS = ['Donor Pays', 'NGO Pays'];

const INITIAL_DATA = [
  {
    id: '1',
    title: 'Fresh Organic Lunch Packs (40)',
    category: 'Food',
    status: 'Available',
    logistics: 'Donor Pays',
    location: 'Banjara Hills, Hyderabad',
    donor: 'Paradise Biryani',
    deliveryPartner: null,
    eta: null,
    timestamp: '2 hours ago'
  },
  {
    id: '2',
    title: 'Grade 10 NCERT Textbooks',
    category: 'Education',
    status: 'Claimed',
    logistics: 'NGO Pays',
    location: 'Gachibowli, Hyderabad',
    donor: 'Private Donor',
    deliveryPartner: 'Porter',
    eta: '45 mins',
    timestamp: '5 hours ago'
  }
];

// =============================================================================
// 2. UI COMPONENTS
// =============================================================================
const Button = ({ children, variant = 'primary', onClick, className = '', disabled = false }) => {
  const variants = {
    primary: 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm',
    secondary: 'bg-white text-slate-900 border border-slate-200 hover:bg-slate-50',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100',
    danger: 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200',
    accent: 'bg-indigo-600 text-white hover:bg-indigo-700'
  };
  return (
    <motion.button
      whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}
      disabled={disabled} onClick={onClick}
      className={`px-4 py-2 rounded-full font-medium transition-all duration-200 disabled:opacity-50 ${variants[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
};

const Card = ({ children, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
    className={`bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow ${className}`}
  >
    {children}
  </motion.div>
);

const Badge = ({ children, variant = 'default' }) => {
  const variants = {
    default: 'bg-slate-100 text-slate-600',
    success: 'bg-emerald-50 text-emerald-600',
    warning: 'bg-amber-50 text-amber-600',
    indigo: 'bg-indigo-50 text-indigo-600'
  };
  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${variants[variant]}`}>{children}</span>;
};

// =============================================================================
// 3. MAIN APPLICATION
// =============================================================================
export default function App() {
  const [currentUser, setCurrentUser] = useState(() =>
    JSON.parse(localStorage.getItem('bl_user')) || { role: 'Guest', status: 'Pending', name: '', email: '' }
  );
  const [listings, setListings] = useState(() =>
    JSON.parse(localStorage.getItem('bl_listings')) || INITIAL_DATA
  );

  const [activeTab, setActiveTab] = useState('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [modal, setModal] = useState({ type: null, data: null });

  useEffect(() => {
    localStorage.setItem('bl_user', JSON.stringify(currentUser));
    localStorage.setItem('bl_listings', JSON.stringify(listings));
  }, [currentUser, listings]);

  const filteredListings = useMemo(() => {
    return listings.filter(l =>
      (filterCategory === 'All' || l.category === filterCategory) &&
      (l.title.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [listings, searchQuery, filterCategory]);

  const loginDonor = () => {
    setCurrentUser({ role: 'Donor', status: 'Verified', name: 'Rahul Sharma', email: 'rahul@example.com' });
    setActiveTab('dashboard');
  };

  const loginNGO = () => {
    setCurrentUser({ role: 'NGO', status: 'Pending', name: 'Hope Foundation', email: 'contact@hope.org' });
    setActiveTab('feed');
  };

  const createListing = (data) => {
    const newItem = { ...data, id: Date.now().toString(), status: 'Available', timestamp: 'Just now' };
    setListings([newItem, ...listings]);
    setModal({ type: null, data: null });
  };

  const claimItem = (id) => {
    setListings(prev => prev.map(l => l.id === id ? { ...l, status: 'Claimed', deliveryPartner: 'Porter', eta: '30m' } : l));
    setModal({ type: null, data: null });
  };

  const withdrawItem = (id) => {
    setListings(prev => prev.filter(l => l.id !== id));
    setModal({ type: null, data: null });
  };

  if (currentUser.role === 'Guest') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
        <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase">
              <Heart size={14} fill="currentColor" /> Zero-Waste Initiative
            </div>
            <h1 className="text-7xl font-bold text-slate-900 tracking-tighter">BridgeLocal.</h1>
            <p className="text-xl text-slate-500">Connecting surplus resources to those who need them most. Professional. Transparent. Impactful.</p>
          </div>
          <div className="grid gap-6">
            <Card className="p-8 flex flex-col justify-between h-60 hover:border-indigo-300 cursor-pointer" onClick={loginDonor}>
              <div><h3 className="text-2xl font-bold">I am a Donor</h3><p className="text-slate-500">Quickly list items and track your impact.</p></div>
              <Button className="w-full py-4">Get Started <ArrowRight size={18} className="inline ml-2"/></Button>
            </Card>
            <Card className="p-8 bg-slate-900 text-white border-none flex flex-col justify-between h-60 hover:bg-slate-800 cursor-pointer" onClick={loginNGO}>
              <div><h3 className="text-2xl font-bold">I am an NGO</h3><p className="text-slate-400">Verified access to a network of generous donors.</p></div>
              <Button variant="secondary" className="w-full py-4 text-slate-900">Register Org <ShieldCheck size={18} className="inline ml-2"/></Button>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col md:flex-row">
      <nav className="hidden md:flex w-64 h-screen bg-white border-r border-slate-200 p-6 flex-col justify-between sticky top-0">
        <div className="space-y-8">
          <div className="flex items-center gap-3 text-2xl font-black"><div className="w-8 h-8 bg-indigo-600 rounded-lg" /> BridgeLocal</div>
          <div className="space-y-2">
            {[ {id: 'feed', label: 'Feed', icon: Search}, {id: 'dashboard', label: 'Impact', icon: Trophy} ].map(item => (
              <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium ${activeTab === item.id ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>
                <item.icon size={18}/> {item.label}
              </button>
            ))}
          </div>
        </div>
        <button onClick={() => setCurrentUser({role:'Guest', status:'Pending'})} className="flex items-center gap-3 p-4 text-red-500 text-sm font-medium hover:bg-red-50 rounded-2xl transition-all">
          <LogOut size={18}/> Sign Out
        </button>
      </nav>

      <main className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full pb-24">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{activeTab === 'feed' ? 'Opportunity Feed' : 'Your Impact'}</h2>
            <p className="text-slate-500">Welcome, {currentUser.name}</p>
          </div>
          <div className="flex items-center gap-4">
             <Badge variant={currentUser.status === 'Verified' ? 'success' : 'warning'}>{currentUser.status}</Badge>
             <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600">{currentUser.name[0]}</div>
          </div>
        </header>

        {activeTab === 'feed' && (
          <div className="space-y-6">
            {currentUser.status === 'Pending' ? (
              <div className="h-96 flex flex-col items-center justify-center text-center">
                <Lock size={48} className="text-slate-300 mb-4" />
                <h3 className="text-xl font-bold">Verification Required</h3>
                <p className="text-slate-500 mb-6">Your account is pending review. Please upload your 80G certificates.</p>
                <Button variant="secondary" onClick={() => setCurrentUser({...currentUser, status: 'Verified'})}>Dev Mode: Verify Me</Button>
              </div>
            ) : (
              <>
                <div className="relative mb-8">
                  <Search className="absolute left-4 top-3 text-slate-400" size={20}/>
                  <input className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 outline-none focus:ring-2 ring-indigo-500"
                    placeholder="Search for donations..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredListings.map(l => (
                    <Card key={l.id}>
                      <div className="flex justify-between mb-4">
                        <Badge variant="indigo">{l.category}</Badge>
                        <Badge variant={l.status === 'Available' ? 'success' : 'warning'}>{l.status}</Badge>
                      </div>
                      <h4 className="text-xl font-bold mb-1">{l.title}</h4>
                      <div className="flex items-center gap-1 text-slate-500 text-sm mb-4"><MapPin size={14}/> {l.location}</div>
                      <div className="p-3 bg-slate-50 rounded-xl text-xs flex justify-between mb-6 border border-slate-100">
                        <span className="text-slate-400">Logistics:</span> <span className="font-bold">{l.logistics}</span>
                      </div>
                      {l.status === 'Available' && (
                        <Button className="w-full py-3" onClick={() => setModal({type: 'CLAIM', data: l})}>Claim Donation</Button>
                      )}
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-slate-900 text-white p-8 relative overflow-hidden">
                <Trophy className="absolute -right-4 -bottom-4 text-slate-800" size={120}/>
                <div className="relative z-10">
                  <div className="text-slate-400 text-xs font-bold uppercase mb-2">World Rank</div>
                  <div className="text-4xl font-bold">#42</div>
                </div>
              </Card>
              <Card className="p-8 flex flex-col items-center justify-center text-center">
                <Flame className="text-orange-500 mb-2" size={32} fill="currentColor"/>
                <div className="text-3xl font-bold">12 Days</div>
                <div className="text-slate-500 text-sm">Food Streak</div>
              </Card>
              <Card className="p-8 flex flex-col justify-center">
                <Button variant="accent" className="w-full py-4" onClick={() => setModal({type: 'POST'})}>
                  <Plus size={18} className="inline mr-2"/> List Donation
                </Button>
              </Card>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {listings.filter(l => l.donor === 'Private Donor' || l.donor === 'Paradise Biryani').map(l => (
                <Card key={l.id}>
                  <div className="flex justify-between mb-4"><Badge variant="indigo">{l.category}</Badge><div className="text-xs text-slate-400">{l.timestamp}</div></div>
                  <h4 className="font-bold mb-4">{l.title}</h4>
                  <div className="flex gap-2">
                    {l.status === 'Available' && <Button variant="danger" className="text-xs" onClick={() => setModal({type: 'CANCEL', data: l})}>Withdraw</Button>}
                    {l.status === 'Claimed' && <Button variant="danger" className="text-xs" onClick={() => setModal({type: 'CANCEL', data: l})}>Release</Button>}
                    {l.status === 'In-Transit' && <Button variant="secondary" className="text-xs">Support</Button>}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>

      <AnimatePresence>
        {modal.type === 'POST' && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} className="bg-white rounded-3xl p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold mb-6">New Contribution</h3>
              <div className="space-y-4">
                <input id="p-title" className="w-full p-3 rounded-xl border outline-none" placeholder="What are you donating?" />
                <select id="p-cat" className="w-full p-3 rounded-xl border outline-none">
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
                <input id="p-loc" className="w-full p-3 rounded-xl border outline-none" placeholder="Location (e.g. Banjara Hills)" />
                <select id="p-log" className="w-full p-3 rounded-xl border outline-none">
                  {LOGISTICS.map(l => <option key={l}>{l}</option>)}
                </select>
                <div className="flex gap-2 pt-4">
                  <Button variant="ghost" className="flex-1" onClick={() => setModal({type:null})}>Cancel</Button>
                  <Button variant="primary" className="flex-1" onClick={() => createListing({
                    title: document.getElementById('p-title').value,
                    category: document.getElementById('p-cat').value,
                    location: document.getElementById('p-loc').value,
                    logistics: document.getElementById('p-log').value,
                    donor: 'Private Donor'
                  })}>Publish</Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
        {modal.type === 'CLAIM' && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} className="bg-white rounded-3xl p-8 max-w-md w-full text-center">
              <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mx-auto mb-4"><Truck size={32}/></div>
              <h3 className="text-2xl font-bold mb-2">Confirm Claim</h3>
              <p className="text-slate-500 mb-6">You are claiming {modal.data?.title}. Logistic preference: <b className="text-slate-900">{modal.data?.logistics}</b></p>
              <div className="flex gap-2">
                <Button variant="ghost" className="flex-1" onClick={() => setModal({type:null})}>Cancel</Button>
                <Button variant="primary" className="flex-1" onClick={() => claimItem(modal.data?.id)}>Confirm</Button>
              </div>
            </motion.div>
          </div>
        )}
        {modal.type === 'CANCEL' && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} className="bg-white rounded-3xl p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold mb-2">Withdraw Contribution?</h3>
              <p className="text-slate-500 mb-6">This action will remove the item from the public feed.</p>
              <div className="flex gap-2">
                <Button variant="ghost" className="flex-1" onClick={() => setModal({type:null})}>Keep it</Button>
                <Button variant="danger" className="flex-1" onClick={() => {
                   if(modal.data?.status === 'Available') withdrawItem(modal.data.id);
                   else setListings(prev => prev.map(l => l.id === modal.data.id ? {...l, status: 'Available'} : l));
                   setModal({type:null});
                }}>Confirm</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}