"use client";

import { members } from "@wix/members";
import { products } from "@wix/stores";
import { Button } from "../ui/button";
import CreateProductReviewDialog from "./CreateProductReviewDialog";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useSearchParams } from "next/navigation";

interface CreateProductReviewButtonProps {
  product: products.Product;
  loggedInMember: members.Member | null;
  hasExistingReview: boolean;
}

export default function CreateProductReviewButton({
  product,
  loggedInMember,
  hasExistingReview,
}: CreateProductReviewButtonProps) {
  const searchParams = useSearchParams();

  const [showReviewDialog, setShowReviewDialog] = useState(
    searchParams.has("createReview"),
  );
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

  return (
    <>
      <Button
        onClick={() => setShowReviewDialog(true)}
        disabled={!loggedInMember}
      >
        {loggedInMember ? "Write a review" : "Log in to write a review"}
      </Button>
      <CreateProductReviewDialog
        product={product}
        open={showReviewDialog && !hasExistingReview && !!loggedInMember}
        onOpenChange={setShowReviewDialog}
        onSubmitted={() => {
          setShowReviewDialog(false);
          setShowConfirmationDialog(true);
        }}
      />
      <ReviewSubmittedConfirmationDialog
        open={showConfirmationDialog}
        onOpenChange={setShowConfirmationDialog}
      />
      <ReviewAlreadyExistsDialog
        open={showReviewDialog && hasExistingReview}
        onOpenChange={setShowReviewDialog}
      />
    </>
  );
}

interface ReviewSubmittedConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function ReviewSubmittedConfirmationDialog({
  open,
  onOpenChange,
}: ReviewSubmittedConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Review submitted. Thank you!</DialogTitle>
          <DialogDescription>
            Thank you for your review! It will be published once approved by our
            team.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface ReviewAlreadyExistsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function ReviewAlreadyExistsDialog({
  open,
  onOpenChange,
}: ReviewAlreadyExistsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Review already exists</DialogTitle>
          <DialogDescription>
            You have already written a review for this product. Only one review
            per product is allowed.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
