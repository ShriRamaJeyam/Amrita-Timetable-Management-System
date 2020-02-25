package edu.amrita.timetable;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;

import org.optaplanner.core.api.score.buildin.hardsoft.HardSoftScore;
import org.optaplanner.core.impl.score.director.easy.EasyScoreCalculator;
public class ScoreCalculator implements EasyScoreCalculator<Solver> 
{
	 @Override
	 public HardSoftScore calculateScore(Solver TimeTable) 
	 {
		 int hard=0,soft=0;
		 List<Lecture> lst=TimeTable.leclst;
		 Set<Integer> roomSet=new TreeSet<Integer>();
		 for(int i=0;i!=lst.size();i++)
		 {
			 Lecture I=lst.get(i);
			 if( I.getRoom() != null && I.getWeekday() != null && I.getTimeslot() !=null )
			 {
				 roomSet.add(I.getRoom().getID());
				 for(int j=i+1;j<lst.size();j++)
				 {
					 Lecture J=lst.get(j);
					 if( J.getRoom() != null && J.getWeekday() != null && J.getTimeslot() !=null )
					 {
						 boolean overlap;
						 overlap=(J.getWeekday().getID()==I.getWeekday().getID());
						 overlap = overlap && ((J.getTimeslot().isOverlapping(I.getTimeslot()))||(I.getTimeslot().isOverlapping(J.getTimeslot()))); 
						 if(overlap && J.getRoom().getID()==I.getRoom().getID() && I.getRoom().getID()!=0)
						 {
							 hard-=1;
						 }
						 if(overlap&&MapClass.RegToCurr.get(J.getRegistration())==MapClass.RegToCurr.get(I.getRegistration()) && MapClass.RegToCurr.get(J.getRegistration())!=0)
						 {
							 hard-=1;
						 }
						 if(overlap&&MapClass.RegToFac.get(J.getRegistration())==MapClass.RegToFac.get(I.getRegistration())&&MapClass.RegToFac.get(I.getRegistration())!=0)
						 {
							 hard-=1;
						 }
					 }
				 }
			 }
			 else
			 {
				 if( I.getRoom() == null)
				 hard-=1000;
				 if( I.getWeekday()==null)
					 hard-=1000;
				 if(  I.getTimeslot() ==null )
					 hard-=1000;
			 }
		 }
		 soft-=roomSet.size()*20;
		 MapClass.bfr--;
		 //
		 if(MapClass.bfr==0)
		 {
			 //System.out.println("bfr");
			 MapClass.bfr=500;
			 System.out.println("{"+hard+","+soft+"}\n");
		 }
		 return HardSoftScore.of(hard, soft);
	 }
}
