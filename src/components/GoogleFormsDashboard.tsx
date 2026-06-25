import React, { useState, useEffect } from 'react';
import { 
  googleSignIn, logout, initAuth, getAccessToken 
} from '../lib/googleAuth';
import { 
  Chrome, RefreshCw, LogOut, FileText, Plus, ExternalLink, 
  Trash2, BarChart2, PieChart, Layers, Copy, CheckSquare, 
  Sparkles, AlertTriangle, ArrowRight, CheckCircle2, ChevronRight, 
  Calendar, Users, Info, MessageSquare, List, Send, HelpCircle, Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GoogleFormFile {
  id: string;
  name: string;
  webViewLink: string;
  createdTime: string;
}

interface FormMetadata {
  formId: string;
  info: {
    title: string;
    description?: string;
    documentTitle: string;
  };
  responderUri: string;
  items?: Array<{
    itemId: string;
    title?: string;
    description?: string;
    questionItem?: {
      question: {
        questionId: string;
        required?: boolean;
        choiceQuestion?: {
          type: 'RADIO' | 'CHECKBOX' | 'DROP_DOWN';
          options: Array<{ value: string }>;
        };
        textQuestion?: {
          paragraph?: boolean;
        };
      };
    };
  }>;
}

interface FormResponse {
  responseId: string;
  createTime: string;
  lastSubmittedTime: string;
  answers?: Record<string, {
    questionId: string;
    textAnswers: {
      answers: Array<{ value: string }>;
    };
  }>;
}

export default function GoogleFormsDashboard() {
  const [googleUser, setGoogleUser] = useState<any | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingForms, setIsLoadingForms] = useState(false);
  const [formsList, setFormsList] = useState<GoogleFormFile[]>([]);
  const [activeTab, setActiveTab] = useState<'my-forms' | 'create-form' | 'templates'>('my-forms');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Selected Form Details
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [selectedFormMetadata, setSelectedFormMetadata] = useState<FormMetadata | null>(null);
  const [selectedFormResponses, setSelectedFormResponses] = useState<FormResponse[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Form Creator State
  const [newFormTitle, setNewFormTitle] = useState('');
  const [newFormDesc, setNewFormDesc] = useState('');
  const [newQuestions, setNewQuestions] = useState<Array<{
    title: string;
    type: 'TEXT' | 'RADIO' | 'CHECKBOX';
    required: boolean;
    options: string[];
  }>>([
    { title: 'Full Name', type: 'TEXT', required: true, options: [] },
    { title: 'Project Satisfaction Rating', type: 'RADIO', required: true, options: ['Excellent (5/5)', 'Very Good (4/5)', 'Good (3/5)', 'Satisfactory (2/5)', 'Unsatisfactory (1/5)'] },
    { title: 'Additional Comments or Feedback', type: 'TEXT', required: false, options: [] }
  ]);
  const [isCreatingForm, setIsCreatingForm] = useState(false);
  const [createdFormResult, setCreatedFormResult] = useState<FormMetadata | null>(null);

  // Initialize and check current Google Authentication
  useEffect(() => {
    initAuth(
      (user, token) => {
        setGoogleUser(user);
        setAccessToken(token);
        setIsLoadingAuth(false);
        fetchForms(token);
      },
      () => {
        setGoogleUser(null);
        setAccessToken(null);
        setIsLoadingAuth(false);
      }
    );
  }, []);

  const handleGoogleLogin = async () => {
    try {
      setErrorMsg(null);
      const result = await googleSignIn();
      if (result) {
        setGoogleUser(result.user);
        setAccessToken(result.accessToken);
        fetchForms(result.accessToken);
      }
    } catch (err: any) {
      setErrorMsg('Google authentication authorization failed.');
      console.error(err);
    }
  };

  const handleGoogleLogout = async () => {
    try {
      await logout();
      setGoogleUser(null);
      setAccessToken(null);
      setFormsList([]);
      setSelectedFormId(null);
      setSelectedFormMetadata(null);
      setSelectedFormResponses([]);
      setCreatedFormResult(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Fetch Google Forms from Drive
  const fetchForms = async (token: string) => {
    setIsLoadingForms(true);
    setErrorMsg(null);
    try {
      const q = encodeURIComponent("mimeType='application/vnd.google-apps.form' and trashed=false");
      const res = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name,webViewLink,createdTime)&orderBy=modifiedTime desc`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (!res.ok) {
        throw new Error('Failed to query Google Drive API.');
      }

      const data = await res.json();
      setFormsList(data.files || []);
    } catch (err) {
      setErrorMsg('Failed to synchronize Google Forms. Please ensure you gave sufficient permissions.');
      console.error(err);
    } finally {
      setIsLoadingForms(false);
    }
  };

  // Load detailed form structure & responses
  const handleSelectForm = async (formId: string) => {
    if (!accessToken) return;
    setSelectedFormId(formId);
    setIsLoadingDetails(true);
    setErrorMsg(null);
    setSelectedFormMetadata(null);
    setSelectedFormResponses([]);

    try {
      // 1. Fetch metadata
      const metaRes = await fetch(`https://forms.googleapis.com/v1/forms/${formId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (!metaRes.ok) {
        throw new Error('Form metadata query rejected.');
      }
      const metaData: FormMetadata = await metaRes.json();
      setSelectedFormMetadata(metaData);

      // 2. Fetch responses
      const respRes = await fetch(`https://forms.googleapis.com/v1/forms/${formId}/responses`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (respRes.ok) {
        const respData = await respRes.json();
        setSelectedFormResponses(respData.responses || []);
      } else {
        // Form might not have any responses yet, which returns 404/400. That's acceptable.
        setSelectedFormResponses([]);
      }
    } catch (err: any) {
      setErrorMsg('Could not read details from this form. Please check permissions.');
      console.error(err);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  // Google Form Creator Submit Handler
  const handleCreateGoogleForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken || !newFormTitle) return;

    const confirmed = window.confirm(
      `Are you sure you want to generate a new Google Form named "${newFormTitle}"? This will save the document inside your Google Drive.`
    );
    if (!confirmed) return;

    setIsCreatingForm(true);
    setErrorMsg(null);
    setCreatedFormResult(null);

    try {
      // 1. Create the base form document
      const createRes = await fetch('https://forms.googleapis.com/v1/forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          info: {
            title: newFormTitle,
            documentTitle: newFormTitle,
            description: newFormDesc || 'Created automatically via Deshwal Admin Center.'
          }
        })
      });

      if (!createRes.ok) {
        throw new Error('Base form document creation failed.');
      }

      const createdForm: FormMetadata = await createRes.json();
      const formId = createdForm.formId;

      // 2. Build the question insertion requests
      const requests = newQuestions.map((q, idx) => {
        const itemObj: any = {
          title: q.title,
          questionItem: {
            question: {
              required: q.required,
            }
          }
        };

        if (q.type === 'TEXT') {
          itemObj.questionItem.question.textQuestion = {};
        } else {
          itemObj.questionItem.question.choiceQuestion = {
            type: q.type === 'CHECKBOX' ? 'CHECKBOX' : 'RADIO',
            options: q.options.map(opt => ({ value: opt }))
          };
        }

        return {
          createItem: {
            item: itemObj,
            location: {
              index: idx
            }
          }
        };
      });

      // 3. Dispatch batchUpdate for inserting questions
      if (requests.length > 0) {
        const updateRes = await fetch(`https://forms.googleapis.com/v1/forms/${formId}:batchUpdate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify({ requests })
        });

        if (!updateRes.ok) {
          throw new Error('Failed to insert questionnaire items into Google Form.');
        }
      }

      setSuccessMsg('Google Form successfully instantiated!');
      setCreatedFormResult(createdForm);
      setNewFormTitle('');
      setNewFormDesc('');
      fetchForms(accessToken); // Refresh List
      setActiveTab('my-forms');
      handleSelectForm(formId); // Auto-open detailed view of newly created form
    } catch (err: any) {
      setErrorMsg('Failed to instantiate Google Form. Check your OAuth scopes.');
      console.error(err);
    } finally {
      setIsCreatingForm(false);
    }
  };

  // Helper functions to manage dynamic question inputs in Creator
  const addQuestion = () => {
    setNewQuestions([
      ...newQuestions,
      { title: '', type: 'TEXT', required: false, options: ['Option 1', 'Option 2'] }
    ]);
  };

  const removeQuestion = (idx: number) => {
    setNewQuestions(newQuestions.filter((_, i) => i !== idx));
  };

  const updateQuestionField = (idx: number, field: string, val: any) => {
    const updated = [...newQuestions];
    updated[idx] = { ...updated[idx], [field]: val };
    setNewQuestions(updated);
  };

  const addOptionToQuestion = (qIdx: number) => {
    const updated = [...newQuestions];
    updated[qIdx].options.push(`Option ${updated[qIdx].options.length + 1}`);
    setNewQuestions(updated);
  };

  const updateOptionValue = (qIdx: number, optIdx: number, val: string) => {
    const updated = [...newQuestions];
    updated[qIdx].options[optIdx] = val;
    setNewQuestions(updated);
  };

  const removeOptionFromQuestion = (qIdx: number, optIdx: number) => {
    const updated = [...newQuestions];
    updated[qIdx].options = updated[qIdx].options.filter((_, i) => i !== optIdx);
    setNewQuestions(updated);
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to Clipboard!');
  };

  // Process Response Data to compute Analytics
  const getQuestionAnalytics = (questionId: string, options: string[]) => {
    const counts: Record<string, number> = {};
    options.forEach(opt => { counts[opt] = 0; });
    let totalAnswersForThisQuestion = 0;

    selectedFormResponses.forEach(resp => {
      const answerObj = resp.answers?.[questionId];
      if (answerObj && answerObj.textAnswers?.answers) {
        answerObj.textAnswers.answers.forEach(ans => {
          const matchedOpt = options.find(o => o.toLowerCase() === ans.value.toLowerCase());
          if (matchedOpt) {
            counts[matchedOpt] = (counts[matchedOpt] || 0) + 1;
          } else {
            // Unlisted choice / custom fallback
            counts[ans.value] = (counts[ans.value] || 0) + 1;
          }
          totalAnswersForThisQuestion++;
        });
      }
    });

    return { counts, totalAnswersForThisQuestion };
  };

  const getTextAnswersList = (questionId: string) => {
    const list: string[] = [];
    selectedFormResponses.forEach(resp => {
      const answerObj = resp.answers?.[questionId];
      if (answerObj && answerObj.textAnswers?.answers) {
        answerObj.textAnswers.answers.forEach(ans => {
          if (ans.value) list.push(ans.value);
        });
      }
    });
    return list;
  };

  return (
    <div className="space-y-8 font-sans">
      {/* AUTHENTICATION CONTROL HEADER */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1.5 text-left">
            <h2 className="text-xl font-display font-extrabold text-white tracking-tight flex items-center gap-2">
              <Chrome className="w-5 h-5 text-blue-400" />
              <span>Google Forms Integration</span>
              <span className="text-[10px] uppercase font-mono tracking-wider bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20">Active OAuth</span>
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Design, publish, and analyze Google Forms directly within your workspace dashboards. This module queries Google Drive and the Google Forms REST API with full sandboxed isolation.
            </p>
          </div>

          <div className="shrink-0 self-stretch md:self-auto flex">
            {googleUser ? (
              <div className="flex items-center gap-4 bg-[#030014] border border-white/10 p-2.5 rounded-2xl w-full justify-between md:w-auto">
                <div className="flex items-center gap-2.5 text-left">
                  {googleUser.photoURL ? (
                    <img 
                      src={googleUser.photoURL} 
                      alt="Google User" 
                      className="w-8 h-8 rounded-full border border-blue-500/20"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                      {googleUser.displayName?.charAt(0) || 'G'}
                    </div>
                  )}
                  <div>
                    <h4 className="text-xs font-bold text-white leading-tight">
                      {googleUser.displayName || 'Authorized Admin'}
                    </h4>
                    <p className="text-[9px] text-slate-500 font-mono truncate max-w-[150px]">
                      {googleUser.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleGoogleLogout}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
                  title="Sign out Google Account"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleGoogleLogin}
                className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold px-5 py-3 rounded-2xl text-xs flex items-center justify-center space-x-2 cursor-pointer transition-all hover:scale-[1.02]"
              >
                <Chrome className="w-4 h-4 shrink-0" />
                <span>Sign in with Google Workspace</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* FEEDBACK BADGES */}
      <AnimatePresence mode="wait">
        {errorMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-rose-950/25 border border-rose-800/30 rounded-2xl text-rose-400 text-xs flex items-start space-x-3 text-left"
          >
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <div className="space-y-1">
              <span className="font-bold">Execution Warning:</span>
              <p className="text-slate-400 leading-relaxed">{errorMsg}</p>
            </div>
          </motion.div>
        )}
        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-emerald-950/25 border border-emerald-800/30 rounded-2xl text-emerald-400 text-xs flex items-start space-x-3 text-left"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
            <div className="space-y-1">
              <span className="font-bold">Transaction Confirmed:</span>
              <p className="text-slate-400 leading-relaxed">{successMsg}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {googleUser ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
          {/* LEFT COLUMN: NAVIGATION & FORM DIRECTORY */}
          <div className="lg:col-span-1 space-y-6">
            {/* Dashboard Tabs */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-3 flex gap-2">
              <button
                onClick={() => { setActiveTab('my-forms'); setSelectedFormId(null); setSelectedFormMetadata(null); setSelectedFormResponses([]); }}
                className={`flex-1 py-2 rounded-2xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'my-forms'
                    ? 'bg-white text-black font-extrabold shadow'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                My Forms
              </button>
              <button
                onClick={() => { setActiveTab('create-form'); setSelectedFormId(null); setSelectedFormMetadata(null); setSelectedFormResponses([]); }}
                className={`flex-1 py-2 rounded-2xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'create-form'
                    ? 'bg-white text-black font-extrabold shadow'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Create Form
              </button>
            </div>

            {/* List Forms Widget */}
            {activeTab === 'my-forms' && (
              <div className="bg-white/5 border border-white/10 rounded-3xl p-5 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-blue-400" />
                    <span>Forms Directory ({formsList.length})</span>
                  </h3>
                  <button
                    onClick={() => accessToken && fetchForms(accessToken)}
                    disabled={isLoadingForms}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                    title="Refresh Directory"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingForms ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                <div className="space-y-2.5 max-h-[450px] overflow-y-auto pr-1">
                  {isLoadingForms ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-2">
                      <RefreshCw className="w-6 h-6 animate-spin text-blue-400" />
                      <span className="text-[11px] text-slate-500 font-mono">Syncing Drive documents...</span>
                    </div>
                  ) : formsList.length === 0 ? (
                    <div className="py-12 text-center text-slate-500 font-sans space-y-1">
                      <FileText className="w-8 h-8 text-slate-600 mx-auto opacity-55" />
                      <p className="text-xs">No Google Forms identified in your drive.</p>
                      <button
                        onClick={() => setActiveTab('create-form')}
                        className="text-xs text-blue-400 hover:underline pt-2 inline-block font-semibold"
                      >
                        Compile first form now
                      </button>
                    </div>
                  ) : (
                    formsList.map((form) => (
                      <button
                        key={form.id}
                        onClick={() => handleSelectForm(form.id)}
                        className={`w-full text-left p-3.5 rounded-2xl border transition-all text-xs space-y-1 block ${
                          selectedFormId === form.id
                            ? 'bg-blue-600/15 border-blue-500 text-white shadow-md'
                            : 'bg-[#030014]/55 border-white/5 hover:border-white/15 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1.5">
                          <span className="font-extrabold truncate block flex-1 font-sans">
                            {form.name}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 shrink-0 text-slate-500" />
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono pt-1">
                          <span>ID: {form.id.slice(0, 8)}...</span>
                          <span>{new Date(form.createdTime).toLocaleDateString()}</span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Quick Tips Widget */}
            <div className="bg-white/2 border border-white/5 rounded-3xl p-5 text-xs text-slate-400 leading-relaxed space-y-3">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                <Info className="w-3.5 h-3.5" />
                <span>Architecture Guide</span>
              </div>
              <p>
                Google Forms handles form submissions and validation natively. Our application connects via standard REST endpoints to render detailed analytics directly on this screen.
              </p>
              <div className="border-t border-white/5 pt-2 text-[11px] text-slate-500">
                💡 <span className="font-bold text-slate-400">Embedding Tip:</span> Copy the iframe code generated by the creator and place it on any website page to embed surveys seamlessly.
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: DETAIL DASHBOARD & FORM CREATOR */}
          <div className="lg:col-span-2 min-h-[500px]">
            {/* TABS 1: MY FORMS - FORM SELECTION DETAILS */}
            {activeTab === 'my-forms' && (
              <div className="h-full">
                {!selectedFormId ? (
                  <div className="border border-dashed border-white/10 rounded-3xl p-16 text-center h-full flex flex-col justify-center items-center space-y-4">
                    <Layers className="w-12 h-12 text-slate-600" />
                    <div className="space-y-1.5">
                      <p className="text-sm font-bold text-slate-300">Select a Form from Directory</p>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                        Query your linked Google account's forms to review questions, access analytics, and visualize subscriber answers.
                      </p>
                    </div>
                  </div>
                ) : isLoadingDetails ? (
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center h-full flex flex-col justify-center items-center space-y-3">
                    <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
                    <p className="text-xs text-slate-400 font-mono">Syncing form items and survey answers...</p>
                  </div>
                ) : selectedFormMetadata ? (
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 space-y-8">
                    {/* Form Information Header */}
                    <div className="pb-5 border-b border-white/10 flex flex-col md:flex-row justify-between items-start gap-4">
                      <div className="space-y-1.5">
                        <span className="text-[9px] text-blue-400 font-mono tracking-widest uppercase block">Google Form Metadata</span>
                        <h2 className="text-xl font-display font-extrabold text-white leading-tight">
                          {selectedFormMetadata.info.title}
                        </h2>
                        {selectedFormMetadata.info.description && (
                          <p className="text-xs text-slate-400 font-sans">
                            {selectedFormMetadata.info.description}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-2 pt-1">
                          <span className="text-[10px] font-mono text-slate-500 bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                            ID: {selectedFormMetadata.formId}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 shrink-0 self-stretch md:self-auto">
                        <a
                          href={selectedFormMetadata.responderUri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 md:flex-initial bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center justify-center space-x-1.5 cursor-pointer transition-colors"
                          title="Open Form to Fill In"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>View Form</span>
                        </a>
                        <button
                          onClick={() => handleCopyToClipboard(`<iframe src="${selectedFormMetadata.responderUri}?embedded=true" width="640" height="800" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>`)}
                          className="flex-1 md:flex-initial bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center justify-center space-x-1.5 cursor-pointer transition-colors"
                          title="Copy Embedded iFrame Code"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Embed Code</span>
                        </button>
                      </div>
                    </div>

                    {/* Telemetry Stat Panels */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-[#030014]/40 border border-white/5 p-4.5 rounded-2xl">
                        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">Response Count</span>
                        <span className="text-2xl font-bold font-mono text-white mt-1 block">
                          {selectedFormResponses.length}
                        </span>
                      </div>
                      <div className="bg-[#030014]/40 border border-white/5 p-4.5 rounded-2xl">
                        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">Form Items</span>
                        <span className="text-2xl font-bold font-mono text-blue-400 mt-1 block">
                          {selectedFormMetadata.items?.length || 0}
                        </span>
                      </div>
                      <div className="bg-[#030014]/40 border border-white/5 p-4.5 rounded-2xl">
                        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">Last Response</span>
                        <span className="text-[10px] font-semibold text-purple-400 mt-2 block font-sans truncate">
                          {selectedFormResponses.length > 0 
                            ? new Date(selectedFormResponses[0].createTime).toLocaleString()
                            : 'N/A'
                          }
                        </span>
                      </div>
                    </div>

                    {/* Interactive Survey Analysis */}
                    <div className="space-y-6">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-white/5">
                        <BarChart2 className="w-4 h-4 text-purple-400" />
                        <span>Interactive Responses & Analytics</span>
                      </h3>

                      {selectedFormResponses.length === 0 ? (
                        <div className="border border-dashed border-white/5 rounded-2xl p-8 text-center text-slate-500 text-xs font-sans space-y-1">
                          <HelpCircle className="w-8 h-8 text-slate-600 mx-auto opacity-45" />
                          <p className="font-semibold text-slate-400">No submissions received yet</p>
                          <p className="max-w-xs mx-auto">Spread the link or fill out the form yourself to test real-time telemetry processing.</p>
                        </div>
                      ) : (
                        <div className="space-y-8">
                          {selectedFormMetadata.items?.map((item, idx) => {
                            const qInfo = item.questionItem?.question;
                            if (!qInfo) return null;

                            const isChoice = !!qInfo.choiceQuestion;
                            const qTitle = item.title || 'Question';

                            if (isChoice) {
                              const opts = qInfo.choiceQuestion?.options.map(o => o.value) || [];
                              const { counts, totalAnswersForThisQuestion } = getQuestionAnalytics(qInfo.questionId, opts);

                              return (
                                <div key={item.itemId} className="bg-[#030014]/20 border border-white/5 p-5 rounded-2xl space-y-4">
                                  <div className="flex justify-between items-start gap-2">
                                    <h4 className="text-xs font-extrabold text-white">
                                      {idx + 1}. {qTitle}
                                    </h4>
                                    <span className="text-[9px] font-mono text-slate-500 uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded shrink-0">
                                      Multiple Choice
                                    </span>
                                  </div>

                                  {/* Answer bars visualization */}
                                  <div className="space-y-3.5 text-xs font-sans">
                                    {Object.entries(counts).map(([option, count]) => {
                                      const pct = totalAnswersForThisQuestion > 0 
                                        ? Math.round((count / totalAnswersForThisQuestion) * 100) 
                                        : 0;
                                      return (
                                        <div key={option} className="space-y-1.5">
                                          <div className="flex justify-between text-[11px]">
                                            <span className="text-slate-300 font-medium">{option}</span>
                                            <span className="text-slate-400 font-mono font-bold">
                                              {count} response{count !== 1 ? 's' : ''} ({pct}%)
                                            </span>
                                          </div>
                                          <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden border border-white/5">
                                            <div 
                                              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                                              style={{ width: `${pct}%` }}
                                            />
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            } else {
                              // Text responses listing
                              const textAnswers = getTextAnswersList(qInfo.questionId);

                              return (
                                <div key={item.itemId} className="bg-[#030014]/20 border border-white/5 p-5 rounded-2xl space-y-4">
                                  <div className="flex justify-between items-start gap-2">
                                    <h4 className="text-xs font-extrabold text-white">
                                      {idx + 1}. {qTitle}
                                    </h4>
                                    <span className="text-[9px] font-mono text-slate-500 uppercase bg-purple-500/10 text-purple-400 border border-purple-500/20 px-1.5 py-0.5 rounded shrink-0">
                                      Text Field
                                    </span>
                                  </div>

                                  <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                                    {textAnswers.length === 0 ? (
                                      <p className="text-[11px] text-slate-500 italic">No answers written for this field.</p>
                                    ) : (
                                      textAnswers.map((answer, aIdx) => (
                                        <div key={aIdx} className="bg-white/2 border border-white/5 p-3 rounded-xl text-[11px] text-slate-300 leading-relaxed font-sans">
                                          {answer}
                                        </div>
                                      ))
                                    )}
                                  </div>
                                </div>
                              );
                            }
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            {/* TABS 2: CREATE FORM PANEL */}
            {activeTab === 'create-form' && (
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-md space-y-6">
                <div className="space-y-1.5">
                  <h3 className="text-lg font-display font-extrabold text-white tracking-tight flex items-center gap-1.5">
                    <Sparkles className="w-5 h-5 text-indigo-400" />
                    <span>Instantiate Custom Google Form</span>
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Instantly compile a brand new questionnaire document and synchronize it with Google Drive. This adds questions, choice selectors, and triggers an active web responder url.
                  </p>
                </div>

                <form onSubmit={handleCreateGoogleForm} className="space-y-6 text-xs">
                  {/* Title & Desc */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-slate-400 font-mono tracking-wider uppercase">Form Title *</label>
                      <input
                        type="text"
                        required
                        value={newFormTitle}
                        onChange={(e) => setNewFormTitle(e.target.value)}
                        placeholder="e.g., Client SLA & Onboarding Questionnaire"
                        className="w-full bg-[#030014] border border-white/10 focus:border-blue-500 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-slate-400 font-mono tracking-wider uppercase">Description / Instruction Paragraph</label>
                      <textarea
                        value={newFormDesc}
                        onChange={(e) => setNewFormDesc(e.target.value)}
                        rows={2}
                        placeholder="Outline the objectives of this questionnaire to your respondents..."
                        className="w-full bg-[#030014] border border-white/10 focus:border-blue-500 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans"
                      />
                    </div>
                  </div>

                  {/* Dynamic Questions Builder */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-white/10">
                      <span className="text-slate-300 font-mono uppercase tracking-wider">Configure Questionnaire Items</span>
                      <button
                        type="button"
                        onClick={addQuestion}
                        className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold px-3 py-1.5 rounded-full text-[11px] flex items-center space-x-1 cursor-pointer transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Question</span>
                      </button>
                    </div>

                    <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                      {newQuestions.map((q, qIdx) => (
                        <div key={qIdx} className="bg-[#030014]/40 border border-white/5 p-4 rounded-2xl space-y-4 relative">
                          {/* Close button */}
                          <button
                            type="button"
                            onClick={() => removeQuestion(qIdx)}
                            className="absolute top-3 right-3 text-slate-500 hover:text-rose-400 p-1 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {/* Question Title */}
                            <div className="sm:col-span-2 space-y-1.5">
                              <label className="text-slate-400 font-mono">Question Title *</label>
                              <input
                                type="text"
                                required
                                value={q.title}
                                onChange={(e) => updateQuestionField(qIdx, 'title', e.target.value)}
                                placeholder="e.g. Which of our services did you leverage?"
                                className="w-full bg-[#030014] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none font-sans"
                              />
                            </div>

                            {/* Question Type */}
                            <div className="space-y-1.5">
                              <label className="text-slate-400 font-mono">Input Type</label>
                              <select
                                value={q.type}
                                onChange={(e) => updateQuestionField(qIdx, 'type', e.target.value as any)}
                                className="w-full bg-[#030014] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none font-sans"
                              >
                                <option value="TEXT">Short Text Field</option>
                                <option value="RADIO">Multiple Choice (Radio)</option>
                                <option value="CHECKBOX">Checkboxes</option>
                              </select>
                            </div>
                          </div>

                          {/* Options if Multiple Choice / Checkbox */}
                          {q.type !== 'TEXT' && (
                            <div className="space-y-2.5 bg-[#030014]/50 p-3 rounded-xl border border-white/5">
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] font-mono text-slate-500">Choice Value Selectors</span>
                                <button
                                  type="button"
                                  onClick={() => addOptionToQuestion(qIdx)}
                                  className="text-[10px] text-blue-400 hover:underline font-semibold"
                                >
                                  + Add Option
                                </button>
                              </div>

                              <div className="space-y-2">
                                {q.options.map((opt, optIdx) => (
                                  <div key={optIdx} className="flex items-center gap-2">
                                    <CheckSquare className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                    <input
                                      type="text"
                                      required
                                      value={opt}
                                      onChange={(e) => updateOptionValue(qIdx, optIdx, e.target.value)}
                                      placeholder="Option value"
                                      className="flex-1 bg-[#030014] border border-white/10 rounded-xl px-3 py-1.5 text-[11px] text-white focus:outline-none font-sans"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => removeOptionFromQuestion(qIdx, optIdx)}
                                      className="text-slate-500 hover:text-rose-400 p-1"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Required Toggle */}
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`req-${qIdx}`}
                              checked={q.required}
                              onChange={(e) => updateQuestionField(qIdx, 'required', e.target.checked)}
                              className="rounded bg-white/5 border-white/10 text-blue-500 focus:ring-0"
                            />
                            <label htmlFor={`req-${qIdx}`} className="text-[11px] text-slate-400 font-sans cursor-pointer">
                              Mark question response as Mandatory
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isCreatingForm}
                    className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold py-4 rounded-xl text-xs flex items-center justify-center space-x-2 cursor-pointer shadow-lg active:scale-95 transition-all"
                  >
                    {isCreatingForm ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        <span>Compiling Form Structures on Google Cloud...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Generate & Publish Google Form</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* LOCK STATE SCREEN */
        <div className="max-w-md mx-auto py-12 px-4">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6 text-center">
            <Layers className="w-12 h-12 text-blue-500 mx-auto animate-pulse" />
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-white">Google Authorization Required</h3>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                Connect your Google Workspace credentials. We query your direct forms dynamically and never share your confidential database properties.
              </p>
            </div>
            <button
              onClick={handleGoogleLogin}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3.5 rounded-xl text-xs flex items-center justify-center space-x-2 cursor-pointer transition-all duration-300 active:scale-95 shadow-lg shadow-blue-500/10"
            >
              <Chrome className="w-4 h-4" />
              <span>Connect Google Account</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
