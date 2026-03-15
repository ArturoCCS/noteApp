import type {
	ExpressiveCodeConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./config";

export type WorkspacePages = {
	about?: string;
};

export type WorkspaceConfig = {
	slug: string;
	ownerUid: string;
	isPublic: boolean;
	site: SiteConfig;
	navBar: NavBarConfig;
	profile: ProfileConfig;
	license: LicenseConfig;
	expressiveCode: ExpressiveCodeConfig;
	pages: WorkspacePages;
	updatedAt?: Date;
};
