import {
  CreateMission as CreateMissionEvent,
  CreateSubmission as CreateSubmissionEvent,
  CompleteMission as CompleteMissionEvent,
} from "../generated/Wishpool5/Wishpool5";
import {
  Mission,
  Submission,
  MissionCreateEvent,
  CreateSubmissionEvent as CreateSubmissionEventEntity,
  MissionCompleteEvent,
} from "../generated/schema";
import { fromWei } from "./number";

export function handleCreateMission(event: CreateMissionEvent): void {
  let mission = new Mission(event.params.missionId.toString());
  mission.asset = event.params.missionId.toString();
  mission.creator = event.params.creator;
  mission.solver = event.params.solver;
  mission.completed = false;
  mission.createdAt = event.block.timestamp;
  mission.save();

  let createEvent = new MissionCreateEvent(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  createEvent.missionId = event.params.missionId;
  createEvent.creator = event.params.creator;
  createEvent.solver = event.params.solver;
  createEvent.blockNumber = event.block.number;
  createEvent.blockTimestamp = event.block.timestamp;
  createEvent.transactionHash = event.transaction.hash;
  createEvent.save();
}

export function handleCreateSubmission(event: CreateSubmissionEvent): void {
  let submission = new Submission(event.params.submissionId.toString());
  submission.mission = event.params.missionId.toString();
  submission.solver = event.params.solver;
  submission.asset = event.params.submissionId.toString();
  submission.submittedAt = event.block.timestamp;
  submission.save();

  let submitEvent = new CreateSubmissionEventEntity(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  submitEvent.missionId = event.params.missionId;
  submitEvent.solver = event.params.solver;
  submitEvent.submissionId = event.params.submissionId;
  submitEvent.blockNumber = event.block.number;
  submitEvent.blockTimestamp = event.block.timestamp;
  submitEvent.transactionHash = event.transaction.hash;
  submitEvent.save();
}

export function handleCompleteMission(event: CompleteMissionEvent): void {
  let mission = Mission.load(event.params.missionId.toString());
  if (mission) {
    mission.completed = true;
    mission.solver = event.params.solver;
    mission.completedAt = event.block.timestamp;
    mission.completedSubmission = event.params.submissionId.toString();
    mission.ethAmount = fromWei(event.params.ethAmount);
    mission.save();
  }

  let completeEvent = new MissionCompleteEvent(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  completeEvent.missionId = event.params.missionId;
  completeEvent.solver = event.params.solver;
  completeEvent.submissionId = event.params.submissionId;
  completeEvent.tokenAmount = fromWei(event.params.tokenAmount);
  completeEvent.ethAmount = fromWei(event.params.ethAmount);
  completeEvent.blockNumber = event.block.number;
  completeEvent.blockTimestamp = event.block.timestamp;
  completeEvent.transactionHash = event.transaction.hash;
  completeEvent.save();
}
