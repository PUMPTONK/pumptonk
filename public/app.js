document.getElementById('connectWalletForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const user_id = document.getElementById('user_id').value;

  try {
      const response = await fetch('/connect-wallet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, user_id })
      });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Network response was not ok');
      }

      const result = await response.json();
      document.getElementById('walletDetails').textContent = JSON.stringify(result, null, 2);
  } catch (error) {
      document.getElementById('walletDetails').textContent = `Error: ${error.message}`;
      console.error('Error:', error);
  }
});

document.getElementById('createTokenForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const user_id = document.getElementById('tokenUserId').value;
  const name = document.getElementById('name').value;
  const symbol = document.getElementById('symbol').value;
  const description = document.getElementById('description').value;
  const image = document.getElementById('image').value;
  const twitter_link = document.getElementById('twitter_link').value;

  try {
      const response = await fetch('/create-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id, name, symbol, description, image, twitter_link })
      });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Network response was not ok');
      }

      const result = await response.json();
      document.getElementById('createdToken').textContent = JSON.stringify(result, null, 2);
  } catch (error) {
      document.getElementById('createdToken').textContent = `Error: ${error.message}`;
      console.error('Error:', error);
  }
});

document.getElementById('likeTokenForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const user_id = document.getElementById('likeUserId').value;
  const token_id = document.getElementById('token_id').value;

  try {
      const response = await fetch('/like-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id, token_id })
      });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Network response was not ok');
      }

      const result = await response.json();
      document.getElementById('likedToken').textContent = JSON.stringify(result, null, 2);
  } catch (error) {
      document.getElementById('likedToken').textContent = `Error: ${error.message}`;
      console.error('Error:', error);
  }
});
