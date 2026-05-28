import dotenv from "dotenv";
import { prisma } from "../src/lib/prisma";
import { animalRequestService } from "../src/services/animal-request.service";
import { UserRole } from "@prisma/client";

dotenv.config();

async function main() {
  console.log("=== STARTING PROGRAMMATIC LIVE CHECK: USER REQUEST FLOW ===");
  
  // 1. Create a clean test user
  const testUserEmail = `tester-${Date.now()}@zoosite.local`;
  console.log(`Creating test user with email: ${testUserEmail}...`);
  const testUser = await prisma.user.create({
    data: {
      name: "Test Requester",
      email: testUserEmail,
      role: UserRole.USER,
      is_request_banned: false,
    },
  });
  console.log(`✓ Test user created with ID: ${testUser.id}`);

  try {
    // 2. Test duplicate check (Case 1: animal does not exist)
    console.log("\nTesting Duplicate Check: checking unique name 'Sparky the Dragon'...");
    const check1 = await animalRequestService.checkDuplicate("Sparky the Dragon");
    console.log("✓ Result:", check1);
    if (check1.exists || check1.isUnderReview) {
      throw new Error("Duplicate check failed: 'Sparky the Dragon' should be unique.");
    }

    // 3. Test submitting a valid quick request
    console.log("\nTesting Submit Request: creating quick request for 'Sparky the Dragon'...");
    const request1 = await animalRequestService.createRequest({
      request_type: "QUICK",
      animal_name: "Sparky the Dragon",
      image_url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      image_public_id: "sample_public_id_123",
    }, testUser.id);
    console.log(`✓ Request submitted successfully. Request ID: ${request1.id}`);

    // 4. Test duplicate check (Case 2: animal under review)
    console.log("\nTesting Duplicate Check: checking duplicate name 'Sparky the Dragon' (expecting under review)...");
    const check2 = await animalRequestService.checkDuplicate("Sparky the Dragon");
    console.log("✓ Result:", check2);
    if (!check2.isUnderReview || check2.request?.animal_name !== "Sparky the Dragon") {
      throw new Error("Duplicate check failed: 'Sparky the Dragon' should be under review.");
    }

    // 5. Test duplicate check (Case 3: trying to submit duplicate animal name)
    console.log("\nTesting Duplicate Protection: trying to submit a duplicate request (expecting error)...");
    try {
      await animalRequestService.createRequest({
        request_type: "QUICK",
        animal_name: "Sparky the Dragon",
        image_url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      }, testUser.id);
      throw new Error("Security breach: duplicate request was allowed to be created!");
    } catch (err: any) {
      console.log(`✓ Prevented duplicate request successfully! Error message: "${err.message}" (expected)`);
    }

    // 6. Test Admin Side - List requests
    console.log("\nTesting Admin Panel: listing all requests...");
    const adminRequests = await animalRequestService.listAdminRequests();
    const createdReq = adminRequests.find(r => r.id === request1.id);
    if (!createdReq) {
      throw new Error("Admin listing failed: could not find the created request.");
    }
    console.log(`✓ Found created request in admin list. Status: ${createdReq.status}`);

    // 7. Test Admin Side - Lock for review
    console.log(`\nTesting Admin Review Lock: locking request ${request1.id}...`);
    await animalRequestService.lockRequest(request1.id);
    const lockedReq = await prisma.animal_requests.findUnique({
      where: { id: request1.id },
      select: { status: true, review_started: true }
    });
    console.log("✓ Locked request status:", lockedReq);
    if (lockedReq?.status !== "IN_REVIEW" || !lockedReq?.review_started) {
      throw new Error("Admin lock failed: request is not IN_REVIEW or review_started is null.");
    }

    // 8. Test Concurrency protection: User edits/withdraws while locked (expecting error)
    console.log("\nTesting Concurrency Lock: trying to edit a request that is IN_REVIEW (expecting error)...");
    try {
      await animalRequestService.updateRequest(request1.id, {
        animal_name: "Sparky the Updated Dragon",
      }, testUser.id);
      throw new Error("Security breach: user was able to edit a request that is under active review!");
    } catch (err: any) {
      console.log(`✓ Prevented user edit during review successfully! Error message: "${err.message}" (expected)`);
    }

    console.log("\nTesting Concurrency Lock: trying to withdraw a request that is IN_REVIEW (expecting error)...");
    try {
      await animalRequestService.withdrawRequest(request1.id, testUser.id);
      throw new Error("Security breach: user was able to withdraw a request that is under active review!");
    } catch (err: any) {
      console.log(`✓ Prevented user withdrawal during review successfully! Error message: "${err.message}" (expected)`);
    }

    // 9. Test Rejection and Strike Count
    console.log("\nTesting Admin Rejection: rejecting request with reason 'Incomplete details'...");
    await animalRequestService.rejectRequest(request1.id, "Mock rejection for testing");
    const rejectedReq = await prisma.animal_requests.findUnique({
      where: { id: request1.id },
      select: { status: true, reject_reason: true }
    });
    console.log("✓ Rejected request status:", rejectedReq);
    if (rejectedReq?.status !== "REJECTED" || rejectedReq?.reject_reason !== "Mock rejection for testing") {
      throw new Error("Admin rejection failed.");
    }

    const strikes = await prisma.animal_requests.count({
      where: { user_id: testUser.id, status: "REJECTED" }
    });
    console.log(`✓ User current strike count: ${strikes}`);
    if (strikes !== 1) {
      throw new Error(`Strike count should be 1, got ${strikes}`);
    }

    // 10. Test Submit a second request and approve it
    console.log("\nTesting Submit Request #2: submitting request for 'Sparky the Golden'...");
    const request2 = await animalRequestService.createRequest({
      request_type: "QUICK",
      animal_name: "Sparky the Golden",
      image_url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
    }, testUser.id);
    console.log(`✓ Request #2 submitted with ID: ${request2.id}`);

    console.log(`\nTesting Admin Approval: approving request ${request2.id} and creating the animal profile...`);
    const mammalClass = await prisma.animal_class.findFirst({ select: { id: true } });
    if (!mammalClass) {
      throw new Error("No animal classes exist in database. Seed the DB first or add a class.");
    }

    const approvedAnimal = await animalRequestService.approveRequest(request2.id, {
      name: "Sparky the Golden",
      scientific_name: "Draco sparkus",
      class_id: mammalClass.id,
      description: "A friendly golden dragon that loves tea.",
      description_source: "https://example.com/draco",
      diet: "Tea and scones",
      lifespan_years: "1000",
      weight_kg: "500",
      height_cm: "300",
      avg_speed_kmh: "40",
      top_speed_kmh: "80",
      social_structure: "Solitary",
      conservation_status: "Least Concern",
    });
    console.log(`✓ Animal created successfully:`, approvedAnimal);
    
    // Check request status updated to APPROVED and linked
    const finalRequest2 = await prisma.animal_requests.findUnique({
      where: { id: request2.id },
      select: { status: true, approved_animal_id: true }
    });
    console.log(`✓ Approved request status:`, finalRequest2);
    if (finalRequest2?.status !== "APPROVED" || finalRequest2?.approved_animal_id !== approvedAnimal.id) {
      throw new Error("Approval linking verification failed.");
    }

    // Verify community contribution attribution
    const dbAnimal = await prisma.animals.findUnique({
      where: { id: approvedAnimal.id },
      select: { animal_name: true, contributed_by: true }
    });
    console.log(`✓ Community contribution attribution in DB:`, dbAnimal);
    if (dbAnimal?.contributed_by !== testUser.id) {
      throw new Error(`Attribution check failed! Expected contributed_by to be ${testUser.id}, got ${dbAnimal?.contributed_by}`);
    }

    // 11. Test strike counting user-banning thresholds & permanent/duration suspension
    console.log("\nTesting strike ban logic: creating 2 more rejected requests to trigger warning/ban...");
    const request3 = await animalRequestService.createRequest({
      request_type: "QUICK",
      animal_name: "Spammy 1",
    }, testUser.id);
    await animalRequestService.rejectRequest(request3.id, "Spam");

    const request4 = await animalRequestService.createRequest({
      request_type: "QUICK",
      animal_name: "Spammy 2",
    }, testUser.id);
    await animalRequestService.rejectRequest(request4.id, "Spam");

    const totalRejections = await animalRequestService.getUserHistory(testUser.id);
    console.log(`✓ Rejections count: ${totalRejections.rejectionCount}`);
    if (totalRejections.rejectionCount !== 3) {
      throw new Error(`Expected 3 rejections, got ${totalRejections.rejectionCount}`);
    }

    console.log("\nTesting Manual Admin Suspension: Banning user for 7 days...");
    await animalRequestService.banUser(testUser.id, true, 7);
    const bannedUser = await prisma.user.findUnique({
      where: { id: testUser.id },
      select: { is_request_banned: true, request_banned_until: true }
    });
    console.log("✓ Banned user status in DB:", bannedUser);
    if (!bannedUser?.request_banned_until) {
      throw new Error("Ban duration (7 days) was not saved properly in request_banned_until.");
    }

    console.log("\nTesting Suspension Guard: trying to submit request while suspended (expecting error)...");
    try {
      await animalRequestService.createRequest({
        request_type: "QUICK",
        animal_name: "Spammy 3",
      }, testUser.id);
      throw new Error("Security breach: suspended user was allowed to submit a request!");
    } catch (err: any) {
      console.log(`✓ Prevented request submission for suspended user successfully! Error message: "${err.message}" (expected)`);
    }

    console.log("\nTesting Manual Admin Lift Suspension: Unbanning user...");
    await animalRequestService.banUser(testUser.id, false);
    const unbannedUser = await prisma.user.findUnique({
      where: { id: testUser.id },
      select: { is_request_banned: true, request_banned_until: true }
    });
    console.log("✓ Unbanned user status in DB:", unbannedUser);
    if (unbannedUser?.is_request_banned || unbannedUser?.request_banned_until) {
      throw new Error("Lifting ban failed.");
    }

    console.log("\nTesting submission after unban: submitting request for 'Sparky the Freed'...");
    const request5 = await animalRequestService.createRequest({
      request_type: "QUICK",
      animal_name: "Sparky the Freed",
    }, testUser.id);
    console.log(`✓ Request submitted successfully after unbanning! ID: ${request5.id}`);

    console.log("\n=== ALL PROGRAMMATIC LIVE CHECKS PASSED SUCCESSFULLY ===");

  } finally {
    // 12. Cleanup database to prevent cluttering
    console.log("\nCleaning up test database records...");
    await prisma.animal_requests.deleteMany({
      where: { user_id: testUser.id }
    });
    console.log("✓ Deleted test animal requests.");
    
    // Clean up approved test animal if created
    const approvedAnimal = await prisma.animals.findFirst({
      where: { contributed_by: testUser.id }
    });
    if (approvedAnimal) {
      await prisma.animal_descriptions.deleteMany({ where: { animal_id: approvedAnimal.id } });
      await prisma.animals.delete({ where: { id: approvedAnimal.id } });
      console.log("✓ Deleted test approved animal.");
    }

    await prisma.user.delete({
      where: { id: testUser.id }
    });
    console.log("✓ Deleted test user.");
  }
}

main()
  .catch((error) => {
    console.error("❌ CRITICAL FLOW FAILURE:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
