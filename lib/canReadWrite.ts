import { stackServerApp } from "@/stack/server";

const requiredTeamId: string = process.env.STACK_ADMIN_TEAM_ID ?? (() => { 
  throw new Error("STACK_ADMIN_TEAM_ID environment variable is not set"); 
})();

type Params = {
  redirectToLogin?: boolean;
}

export default async function canReadWrite(options: Params = {redirectToLogin: false}): Promise<boolean> {
  const user = await stackServerApp.getUser(options.redirectToLogin ? { or: 'redirect' } : {});

  if (!user) return false;
  
  const requiredTeam = await stackServerApp.getTeam(requiredTeamId);

  if (!requiredTeam) {
    throw new Error("Internal Server Error: Unable to complete authorization check");
  }
  const permission = await user.getPermission(requiredTeam, 'read_messages');

  // Verify Permission
  if (permission?.id === 'read_messages') {
    return true;
  }

  return false;
}