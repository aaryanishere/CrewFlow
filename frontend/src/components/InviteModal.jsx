import React, { useState } from 'react';
import { Mail, X, Send } from 'lucide-react';

const InviteModal = ({ onClose, onSuccess }) => {
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Member');
  const [isInviting, setIsInviting] = useState(false);

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail) return;
    
    setIsInviting(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsInviting(false);
    onSuccess(inviteEmail);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-scale-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e2e2]">
          <h3 className="text-lg font-bold text-[#1a1c1c] font-sans">Invite a Teammate</h3>
          <button 
            onClick={onClose}
            className="text-[#777777] hover:text-[#1a1c1c] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleInvite} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#5e5e5e] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#777777]">
                <Mail className="h-4 w-4" />
              </span>
              <input
                type="email"
                required
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="teammate@company.com"
                className="w-full text-xs p-2.5 pl-9 bg-[#f9f9f9] border border-[#e2e2e2] rounded focus:border-[#000000] outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#5e5e5e] mb-1.5">
              Workspace Role
            </label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="w-full text-xs p-2.5 bg-[#f9f9f9] border border-[#e2e2e2] rounded focus:border-[#000000] outline-none transition-colors"
            >
              <option value="Member">Member (Limited access)</option>
              <option value="Admin">Admin (Full access)</option>
            </select>
            <p className="text-[10px] text-[#777777] mt-1.5">
              Admins can create projects and tasks. Members can only view and update assigned tasks.
            </p>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#5e5e5e] hover:text-[#1a1c1c] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isInviting || !inviteEmail}
              className="flex items-center gap-1.5 px-5 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-neutral-800 disabled:opacity-50 transition-colors"
            >
              {isInviting ? (
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Send className="h-3.5 w-3.5" />
              )}
              <span>{isInviting ? 'Sending...' : 'Send Invite'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteModal;
