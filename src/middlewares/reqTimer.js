export const reqTimer = (req,res,next) => {
  const startTime = Date.now();
  
  res.on('finsh', () => {
    const duration = Date.now() = startTime;
    console.log(`reqTime: ${duration}ms`);
  });

  next();
}