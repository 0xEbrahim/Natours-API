import Tour from '../../models/tourModel.js';
const checkId = (req, res, next, id) => {
  
};

const checkBody = (req, res, next) => {
 
};
const getAllTours = (req, res) => {
 
};
const deleteTour = (req, res) => {
  
};
const createNewTour = async (req, res) => {
 
};
const getSingleTour = (req, res) => {
  const { id } = req.params;
  const tour = tours.find(el => +el.id === +id);
  res.status(200).json({
    status: 'Success',
    data: {
      tour
    }
  });
};
const updateTour = (req, res) => {
  
};
export {
  getAllTours,
  getSingleTour,
  updateTour,
  deleteTour,
  createNewTour,
  checkId,
  checkBody
};
