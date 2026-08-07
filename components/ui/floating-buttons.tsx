"use client";

export function FloatingButtons() {
  return (
    <>
      {/* WhatsApp Button (Left Side) */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-3">
        <a 
          href="https://wa.me/919313225740" 
          target="_blank" 
          rel="noreferrer"
          className="w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform relative group"
        >
          {/* Pulse effect */}
          <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-50 animate-ping group-hover:animate-none"></span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="currentColor" className="relative z-10"><path d="M12.031 0C5.408 0 0 5.405 0 12.029c0 2.115.55 4.183 1.595 6.002L.032 23.593l5.727-1.503c1.758.948 3.737 1.452 5.767 1.452h.005c6.621 0 12.027-5.407 12.027-12.033 0-3.21-1.25-6.226-3.518-8.496C17.771 1.25 14.757.001 12.031 0zm.005 21.542h-.003c-1.879 0-3.719-.504-5.334-1.46l-.382-.227-3.966 1.041 1.061-3.868-.249-.396c-1.049-1.664-1.603-3.592-1.603-5.589 0-5.741 4.673-10.414 10.42-10.414 2.784 0 5.403 1.085 7.37 3.053 1.968 1.967 3.052 4.585 3.052 7.369 0 5.742-4.673 10.414-10.415 10.414zM17.75 13.918c-.313-.157-1.855-.916-2.143-1.021-.288-.105-.497-.157-.707.157-.21.314-.809 1.021-.992 1.23-.183.21-.366.236-.679.079-.313-.157-1.325-.489-2.524-1.556-.934-.83-1.564-1.856-1.748-2.17-.183-.314-.02-.484.137-.64.141-.14.313-.366.47-.55.157-.183.21-.314.314-.523.104-.21.052-.393-.026-.55-.078-.157-.707-1.702-.969-2.33-.255-.611-.515-.528-.707-.538-.184-.009-.393-.009-.603-.009-.21 0-.55.079-.838.393-.288.314-1.099 1.074-1.099 2.619 0 1.546 1.125 3.039 1.282 3.249.157.21 2.219 3.388 5.378 4.747 3.159 1.359 3.159.904 3.735.852.576-.052 1.855-.758 2.117-1.492.262-.733.262-1.36.183-1.492-.078-.131-.287-.209-.601-.366z"/></svg>
        </a>
      </div>

      {/* Back to Top Button (Right Side) */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <button 
          onClick={() => {
            if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          className="w-14 h-14 bg-gradient-to-br from-[#7C2D12] to-[#5a1e0b] text-[#f3efe8] border border-[#7C2D12]/30 rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
        </button>
      </div>
    </>
  );
}
