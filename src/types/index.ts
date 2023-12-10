export interface IAuthState {
  password: string;
  valid: boolean;
}

export interface IChannel {
  id: string;
  name: string;
  type: number;
}

export interface IRole {
  id: string;
  name: string;
  position: number;
  color: number;
}

export interface ILeaderboardMember {
  id: string;
  username: string;
  avatar: string;
  level: number;
  xp: number;
  maxXp: number;
}

export interface IEmbedField {
  name: string;
  value: string;
  inline: boolean;
}

export interface IEmbed {
  title: string; // Embed title.
  description: string; // Embed description.
  url: string; // Embed URL.
  timestamp?: string; // Embed timestamp in epoch time.
  color: number; // Embed color.
  image: { url: string }; // Embed image URL.
  thumbnail: { url: string }; // Embed thumbnail URL.
  footer: IEmbedFooter; // Embed footer object.
  author: IEmbedAuthor; // Embed author object.
  fields: IEmbedField[]; // Embed fields array.
}

export interface IEmbedFooter {
  text: string; // Embed footer text.
  iconUrl: string; // Embed footer icon URL.
}

export interface IEmbedAuthor {
  name: string; // Embed author name.
  url: string; // Embed author URL.
  iconUrl: string; // Embed author icon URL.
}
