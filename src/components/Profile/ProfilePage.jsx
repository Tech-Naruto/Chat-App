
import Profile from "./Profile"
function ProfilePage({ type }) {
  return (
    <div className="min-w-1/4 bg-white font-hyperlegible-mono relative rounded-2xl">
      <Profile type={ type }/>
    </div>
  );
}

export default ProfilePage;