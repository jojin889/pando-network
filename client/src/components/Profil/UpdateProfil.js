import React, { useEffect, useState } from "react";
import LeftNav from "../LeftNav";
import { useSelector, useDispatch } from "react-redux";
import UploadImg from "./UploadImg";
import { updateBio } from "../../actions/user.action";
import { dateParser, isEmpty } from "../../utils/utils";
import FollowHandler from "./FollowHandler";
import { Image } from "cloudinary-react";

const UpdateProfil = () => {
  const [bio, setBio] = useState("");
  const [updateForm, setUpdateForm] = useState(false);
  const userData = useSelector((state) => state.userReducer);
  const usersData = useSelector((state) => state.usersReducer);
  const dispatch = useDispatch();
  const [followingPopup, setFollowingPopup] = useState(false);
  const [followersPopup, setFollowersPopup] = useState(false);
  const error = useSelector((state) => state.errorReducer.userError);
  const [isLoading, setIsLoading] = useState(true);

  const handleUpdate = () => {
    dispatch(updateBio(userData._id, bio));
    setUpdateForm(false);
  };

  useEffect(() => {
    !isEmpty(usersData[0]) && setIsLoading(false);
  }, [userData]);

  return (
    <>
      <h1>Profil de {userData.pseudo}</h1>
      <div className="profil-container">
        <LeftNav />

        <div className="update-container">
          <div className="left-part">
            <h3>Photo de profil</h3>
            {isLoading ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              <Image
                cloudName="dacysbnkf"
                publicId={`${userData.picture}`}
                alt="user-pic"
              />
            )}
            <UploadImg />
            <p>{error.maxSize}</p>
            <p>{error.format}</p>
          </div>
          <div className="right-part">
            <div className="bio-udpate">
              <h3>Bio</h3>
              {updateForm === false && (
                <>
                  <p onClick={() => setUpdateForm(!updateForm)}>
                    {userData.bio}
                  </p>
                  <button onClick={() => setUpdateForm(!updateForm)}>
                    Modifier bio
                  </button>
                </>
              )}
              {updateForm && (
                <>
                  <textarea
                    type="text"
                    onChange={(e) => setBio(e.target.value)}
                    defaultValue={userData.bio}
                  ></textarea>
                  <button onClick={handleUpdate}>Valider</button>
                </>
              )}
            </div>
            <h4>Membre depuis le : {dateParser(userData.createdAt)}</h4>
            <h5 onClick={() => setFollowingPopup(true)}>
              Abonnements : {userData.following?.length}
            </h5>
            <h5 onClick={() => setFollowersPopup(true)}>
              Abonnés : {userData.followers?.length}
            </h5>
          </div>
        </div>
        {followersPopup && (
          <div className="popup-profil-container">
            <div className="modal">
              <h3>Abonnés</h3>
              <span className="cross" onClick={() => setFollowersPopup(false)}>
                &#10005;
              </span>
              <ul>
                {usersData.map((user) => {
                  for (let i = 0; i < userData.followers.length; i++) {
                    if (user._id === userData.followers[i]) {
                      return (
                        <li key={user._id}>
                          <img src={user.picture} alt="user-pic" />
                          <h4>{user.pseudo}</h4>
                          <div className="follow-handler">
                            <FollowHandler
                              idToFollow={user._id}
                              type={"suggestion"}
                            />
                          </div>
                        </li>
                      );
                    }
                  }
                  return null;
                })}
              </ul>
            </div>
          </div>
        )}
        {followingPopup && (
          <div className="popup-profil-container">
            <div className="modal">
              <h3>Abonnements</h3>
              <span className="cross" onClick={() => setFollowingPopup(false)}>
                &#10005;
              </span>
              <ul>
                {usersData.map((user) => {
                  for (let i = 0; i < userData.following.length; i++) {
                    if (user._id === userData.following[i]) {
                      return (
                        <li key={user._id}>
                          <img src={user.picture} alt="user-pic" />
                          <h4>{user.pseudo}</h4>
                          <div className="follow-handler">
                            <FollowHandler
                              idToFollow={user._id}
                              type={"suggestion"}
                            />
                          </div>
                        </li>
                      );
                    }
                  }
                  return null;
                })}
              </ul>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UpdateProfil;
