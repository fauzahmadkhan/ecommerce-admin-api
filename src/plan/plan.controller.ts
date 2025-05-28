import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { PlanService } from "./plan.service";
import {
  CreatePlanRequest,
  GetPlanByIdRequest,
  UpdatePlanRequest
} from "../shared/client-pb";
import { Public, Roles } from "../shared/guards";
import { RoleEnum } from "../shared/enums";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";


@ApiBearerAuth('JWT-auth')
@ApiTags('Plan')
@Controller('plan')
export class PlanController {
  constructor(private readonly planService: PlanService) {
  }

  // @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  @Public()
  @Post('create')
  createPlan(
    @Body() payload: CreatePlanRequest,
  ): any {
    return this.planService.createPlan(payload);
  }

  @Public()
  @Get('get')
  getAllPlanRecords(): any {
    return this.planService.getAllPlanRecords();
  }

  @Public()
  @Get('get/:planId')
  getPlanById(
    @Param() { planId }: GetPlanByIdRequest,
  ): any {
    return this.planService.getPlanById(planId);
  }

  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  @Post('update')
  updatePlan(
    @Body() payload: UpdatePlanRequest,
  ): any {
    return this.planService.updatePlan(payload);
  }

  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  @Delete('delete/:planId')
  deletePlanById(
    @Param() { planId }: GetPlanByIdRequest,
  ): any {
    return this.planService.deletePlanById(planId);
  }
}
