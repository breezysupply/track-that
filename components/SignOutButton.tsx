import { useAuth } from './AuthContext';

export default function SignOutButton() {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <li className="mt-6">
      <button onClick={handleSignOut} className="block py-2 px-4 hover:bg-gray-700 rounded">
        Sign Out
      </button>
    </li>
  );
}

