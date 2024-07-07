#This api updates and retrieve user details based on their wallet address

#ENPOINTS:
UPDATE USER DETAILS(POST):
http://localhost:3000/api/users/update?Content-Type=multipart/form-data
{

     "walletAddress": "0x42e2c70e1F8f13A1cE2339D933fa76155346af28",
    "name": "CHALES DARWIN",
    "description": "uploads/profile_pictures/profilePicture-1625678493021.png",
    "profilePicture": "2023-07-07T12:34:56.000Z"
}

FETCH USER DETAILS(GET):
http://localhost:3000/api/users/10x42e2c70e1F8f13A1cE2339D933fa76155346af28

pass wallet address to api url as shown in endpoint url
