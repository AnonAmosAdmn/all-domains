import DomainDisplay from '../components/DomainDisplay';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 p-4">
      <DomainDisplay />
      
      <div className="mt-8 text-center">
        <Link 
          href="https://monad.alldomains.id/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 underline transition-colors"
        >
          Visit AllDomains on Monad
        </Link>
      </div>
    </main>
  );
}