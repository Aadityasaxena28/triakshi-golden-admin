import {Button} from "@/components/ui/button";
import {Card,CardContent,CardHeader,CardTitle} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Review} from "@/DataType/ReviewDT";
import {
  createReview,
  deleteReview,
  editReview,
  getReviewsByProduct,
} from "@/API/ReviewAPI";
import {useToast} from "@/components/ui/use-toast";
import {zodResolver} from "@hookform/resolvers/zod";
import {Pencil,Star,Trash2,X} from "lucide-react";
import {useEffect,useState} from "react";
import {useForm} from "react-hook-form";
import {useLocation,useNavigate,useParams} from "react-router-dom";
import * as z from "zod";

const reviewSchema=z.object({
  customerName:z
    .string()
    .trim()
    .min(2,"Name must be at least 2 characters")
    .max(60,"Name must be less than 60 characters"),

  rating:z
    .number()
    .int("Rating must be a whole number")
    .min(1,"Rating must be at least 1")
    .max(5,"Rating cannot be more than 5"),

  comment:z
    .string()
    .trim()
    .min(10,"Comment must be at least 10 characters")
    .max(500,"Comment must be less than 500 characters"),

  date:z.string().min(1,"Date is required"),

  product_id:z.string().min(1,"Product id is required"),
});

type ReviewFormData=z.infer<typeof reviewSchema>;

interface ProductData{
  _id:string;
  name:string;
  image?:string;
  images?:string[];
  existingImages?:string[];
}

export default function ProductReviewsPage(){
  const navigate=useNavigate();
  const location=useLocation();
  const {productId}=useParams();
  const {toast}=useToast();
  const product=location.state?.product as ProductData|undefined;

  const [reviews,setReviews]=useState<Review[]>([]);
  const [isLoading,setIsLoading]=useState(false);
  const [isSaving,setIsSaving]=useState(false);
  const [editingReviewId,setEditingReviewId]=useState<string|null>(null);

  const finalProductId=product?._id||productId||"";

  const form=useForm<ReviewFormData>({
    resolver:zodResolver(reviewSchema),
    defaultValues:{
      customerName:"",
      rating:5,
      comment:"",
      date:new Date().toISOString().slice(0,10),
      product_id:finalProductId,
    },
  });

  const getErrorMessage=(error:any,fallback:string)=>{
    if(typeof error==="string"){
      return error;
    }

    return (
      error?.response?.data?.message||
      error?.message||
      fallback
    );
  };

  useEffect(()=>{
    if(finalProductId){
      form.setValue("product_id",finalProductId);
      loadReviews(finalProductId);
    }
  },[finalProductId]);

const loadReviews=async(id:string)=>{
    try{
      setIsLoading(true);

      const data=await getReviewsByProduct(id);

      setReviews(Array.isArray(data)?data:[]);
    }catch(error:any){
      console.error("failed to fetch reviews",error);

      setReviews([]);

      toast({
        variant:"destructive",
        title:"Failed to load reviews",
        description:getErrorMessage(error,"Unable to fetch reviews for this product."),
      });
    }finally{
      setIsLoading(false);
    }
  };
  const resetForm=()=>{
    setEditingReviewId(null);

    form.reset({
      customerName:"",
      rating:5,
      comment:"",
      date:new Date().toISOString().slice(0,10),
      product_id:finalProductId,
    });
  };

  const handleSubmit=async(data:ReviewFormData)=>{
    try{
      setIsSaving(true);

      if(!finalProductId){
        toast({
          variant:"destructive",
          title:"Product missing",
          description:"Product id is missing. Please open reviews from the product table.",
        });

        return;
      }

      const payload:Review={
        customerName:data.customerName.trim(),
        rating:data.rating,
        comment:data.comment.trim(),
        date:data.date,
        product_id:finalProductId,
      };

      if(editingReviewId){
        await editReview(payload,editingReviewId);

        toast({
          title:"Review updated",
          description:"The review has been updated successfully.",
        });
      }else{
        await createReview(payload);

        toast({
          title:"Review created",
          description:"The review has been added successfully.",
        });
      }

      await loadReviews(finalProductId);
      resetForm();
    }catch(error:any){
      console.error("failed to save review",error);
      console.error("backend response:",error?.response?.data);

      toast({
        variant:"destructive",
        title:"Failed to save review",
        description:getErrorMessage(error,"Something went wrong while saving the review."),
      });
    }finally{
      setIsSaving(false);
    }
  };

  const handleEdit=(review:Review)=>{
    const id=review._id||review.id;

    if(!id){
      console.error("review id missing");
      return;
    }

    setEditingReviewId(id);

    form.reset({
      customerName:review.customerName||"",
      rating:review.rating||5,
      comment:review.comment||"",
      date:review.date?.slice(0,10)||new Date().toISOString().slice(0,10),
      product_id:review.product_id||finalProductId,
    });
  };

const handleDelete=async(review:Review)=>{
  const id=review._id||review.id;

  if(!id){
    toast({
      variant:"destructive",
      title:"Review id missing",
      description:"Unable to delete this review because its id is missing.",
    });

    return;
  }

  const confirmDelete=window.confirm("Delete this review?");

  if(!confirmDelete){
    return;
  }

  try{
    await deleteReview(id);

    setReviews((oldReviews)=>
      oldReviews.filter((item)=>(item._id||item.id)!==id)
    );

    if(editingReviewId===id){
      resetForm();
    }

    toast({
      title:"Review deleted",
      description:"The review has been deleted successfully.",
    });
  }catch(error:any){
    console.error("failed to delete review",error);

    toast({
      variant:"destructive",
      title:"Failed to delete review",
      description:getErrorMessage(error,"Something went wrong while deleting the review."),
    });
  }
};

  const productImage=
    product?.image||
    product?.images?.[0]||
    product?.existingImages?.[0]||
    "";

  if(!finalProductId){
    return (
      <div className="max-w-5xl mx-auto p-6">
        <Card>
          <CardContent className="py-10 text-center space-y-4">
            <p className="text-muted-foreground">
              Product data is missing. Open this page from the product list.
            </p>

            <Button
              type="button"
              variant="outline"
              onClick={()=>navigate(-1)}
            >
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <Card>
        <CardContent className="p-5">
          <div className="flex flex-col md:flex-row gap-5">
            <div className="w-full md:w-40 h-40 rounded-lg border bg-muted overflow-hidden">
              {productImage?(
                <img
                  src={productImage}
                  alt={product?.name||"Product"}
                  className="w-full h-full object-cover"
                />
              ):(
                <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">
                  No Image
                </div>
              )}
            </div>

            <div className="flex-1 space-y-2">
              <h1 className="text-2xl font-semibold">
                {product?.name||"Product Reviews"}
              </h1>

              <p className="text-sm text-muted-foreground">
                Add, edit, and delete reviews for this product.
              </p>

              <p className="text-sm text-muted-foreground">
                {reviews.length} review{reviews.length===1?"":"s"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {editingReviewId?"Edit Review":"Add Review"}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({field})=>(
                    <FormItem>
                      <FormLabel>Customer Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Aditya Saxena"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rating"
                  render={({field})=>(
                    <FormItem>
                      <FormLabel>Rating *</FormLabel>
                      <FormControl>
                        <div className="flex gap-1">
                          {[1,2,3,4,5].map((value)=>(
                            <button
                              key={value}
                              type="button"
                              onClick={()=>field.onChange(value)}
                              className="p-1"
                            >
                              <Star
                                className={
                                  value<=field.value
                                    ?"h-6 w-6 fill-current"
                                    :"h-6 w-6"
                                }
                              />
                            </button>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="comment"
                  render={({field})=>(
                    <FormItem>
                      <FormLabel>Comment *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write review comment..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>

                      <div className="text-xs text-muted-foreground text-right">
                        {field.value?.length||0}/500
                      </div>

                      <FormMessage/>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({field})=>(
                    <FormItem>
                      <FormLabel>Date *</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-3">
                  {editingReviewId&&(
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetForm}
                    >
                      <X className="h-4 w-4 mr-2"/>
                      Cancel
                    </Button>
                  )}

                  <Button
                    type="button"
                    disabled={isSaving}
                    className="bg-gradient-saffron"
                    onClick={form.handleSubmit(handleSubmit)}
                  >
                    {isSaving
                      ?"Saving..."
                      :editingReviewId
                        ?"Update Review"
                        :"Save Review"}
                  </Button>
                </div>
              </div>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Previous Reviews</CardTitle>
          </CardHeader>

          <CardContent>
            {isLoading?(
              <div className="py-10 text-center text-sm text-muted-foreground">
                Loading reviews...
              </div>
            ):reviews.length===0?(
              <div className="py-10 text-center text-sm text-muted-foreground">
                No reviews added yet.
              </div>
            ):(
              <div className="space-y-4">
                {reviews.map((review)=>(
                  <div
                    key={review._id||review.id}
                    className="rounded-lg border p-4 space-y-3"
                  >
                    <div className="flex justify-between gap-3">
                      <div>
                        <h3 className="font-medium">
                          {review.customerName}
                        </h3>

                        <p className="text-xs text-muted-foreground">
                          {review.date}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={()=>handleEdit(review)}
                        >
                          <Pencil className="h-4 w-4"/>
                        </Button>

                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          onClick={()=>handleDelete(review)}
                        >
                          <Trash2 className="h-4 w-4"/>
                        </Button>
                      </div>
                    </div>

                    <div className="flex gap-1">
                      {[1,2,3,4,5].map((value)=>(
                        <Star
                          key={value}
                          className={
                            value<=review.rating
                              ?"h-4 w-4 fill-current"
                              :"h-4 w-4"
                          }
                        />
                      ))}
                    </div>

                    <p className="text-sm leading-6 text-muted-foreground">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}