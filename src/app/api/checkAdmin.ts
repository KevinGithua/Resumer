import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/firebaseAdmin';  // Import the Firebase Admin SDK instance

const checkAdmin = async (req: NextApiRequest, res: NextApiResponse) => {
  // Ensure this endpoint only handles POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { userUid } = req.body;

  if (!userUid) {
    return res.status(400).json({ error: 'Missing user UID' });
  }

  try {
    const userSnapshot = await db.ref(`/users/${userUid}`).once('value');
    const user = userSnapshot.val();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isAdmin = user.userType === 'admin';

    return res.status(200).json({ isAdmin });
  } catch (error) {
    console.error('Error checking admin status:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export default checkAdmin;
