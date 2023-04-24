import { protectedProcedure } from "../../trpc";
import type { Interest, Skill } from "@prisma/client";
import RedisClient from "../../../../utils/RedisClient";

interface InterestsAndSkill {
  success: boolean;
  interests: Interest[];
  skills: Skill[];
}

const RedisCacheSet = async ({ data }: { data: InterestsAndSkill }) => {
  const expirationTime = 60 * 60 * 24;
  await RedisClient.setEx(
    `trpc:me.getAllInterestsAndSkills`,
    expirationTime,
    JSON.stringify(data)
  );
};
const RedisCacheGet = async () => {
  const data = await RedisClient.get(`trpc:me.getAllInterestsAndSkills`);
  if (data) return JSON.parse(data) as InterestsAndSkill;
};

export const getAllInterestsAndSkills = protectedProcedure.query(
  async ({ ctx }) => {
    const cachedData = await RedisCacheGet();
    if (cachedData) {
      return cachedData;
    }

    const interests: Interest[] = await ctx.prisma.interest.findMany();
    const skills: Skill[] = await ctx.prisma.skill.findMany();

    const interestsAndSkill: InterestsAndSkill = {
      success: true,
      interests,
      skills,
    };
    await RedisCacheSet({ data: interestsAndSkill });
    return interestsAndSkill;
  }
);
