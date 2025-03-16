"use client";
import React from "react";
import styles from "../styles/UserProfile.module.css";
import UserProfileHeader from "./ProfileDetails";
import UserProfileStats from "./ProfileStats";
import UserProfileMilestones from "./ProfileMilestones";

const UserProfile = () => {
  return (
    <div className={styles.userProfile}>
      <div className={styles.contentContainer}>
        <UserProfileHeader />
        <UserProfileStats />
        <UserProfileMilestones />
      </div>
    </div>
  );
}

export default UserProfile;
